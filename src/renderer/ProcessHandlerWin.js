import { spawn, exec } from 'child_process'

class ProcessHandlerWin {
  constructor (settings) {
    this.settings = settings
  }

  create (conn) {
    return new Promise((resolve, reject) => {
      let cmdArgs = [
        'cmd',
        `${conn.user}@${conn.host}:${conn.folder}`,
        conn.mountPoint,
        `-p${conn.port}`,
        '-oidmap=user',
        '-ouid=-1',
        '-ogid=-1',
        '-oumask=000',
        '-ocreate_umask=000',
        `-ovolname=${conn.name.substr(0, 32)}`,
        '-omax_readahead=1GB',
        '-oStrictHostKeyChecking=no',
        '-oUserKnownHostsFile=/dev/null',
        '-oallow_other',
        '-olarge_read',
        '-okernel_cache',
        '-ofollow_symlinks'
      ]

      if (conn.advanced.customCmdlOptionsEnabled) {
        let optionalArgs = []

        conn.advanced.customCmdlOptions.forEach(arg => {
          cmdArgs = cmdArgs.filter(a => a.substr(2, arg.name.length) !== arg.name)

          if (arg.value !== '') {
            optionalArgs.push(`-o${arg.name}=${arg.value}`)
          } else {
            optionalArgs.push(`-o${arg.name}`)
          }
        })

        cmdArgs = [
          ...cmdArgs,
          ...optionalArgs
        ]
      }

      console.log(cmdArgs)

      if (conn.authType === 'password') {
        cmdArgs.push('-oPreferredAuthentications=password')
        cmdArgs.push('-opassword_stdin')
      }

      if (conn.authType === 'key-file') {
        cmdArgs.push('-oPreferredAuthentications=publickey')
        cmdArgs.push(`-oIdentityFile="${conn.keyFile.replace(/\\/g, '/')}"`)
      }

      const childProcess = spawn(this.settings.sshfsBinary, cmdArgs)

      if (conn.authType === 'password') {
        childProcess.stdin.write(conn.password + '\n')
      }

      let intermmediatePid = 0

      this.getChildProcessPid(childProcess.pid).then(pid => {
        intermmediatePid = pid
      })

      childProcess.stderr.on('data', data => {
        reject(data.toString())
      })

      childProcess.on('close', exitCode => {
        if (exitCode === 0) {
          this.getChildProcessPid(intermmediatePid).then(pid => {
            resolve(pid)
          })
        }
      })
    })
  }

  terminate (pid) {
    return new Promise(resolve => {
      exec(`taskkill /PID ${pid} /T /F`, () => {
        resolve()
      })
    })
  }

  exists (pid) {
    return new Promise(resolve => {
      exec(`tasklist /FI "PID eq ${pid}"`, (err, stdout) => {
        if (!err) {
          if (stdout.toString().includes(pid)) {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      })
    })
  }

  getChildProcessPid (parentPid) {
    return new Promise((resolve, reject) => {
      exec(`wmic process where '(name="sshfs.exe" and parentprocessid=${parentPid})' get processid /value`, (err, stdout) => {
        if (!err) {
          resolve(parseInt(stdout.toString().trim().split('=')[1]))
        } else {
          reject(new Error('Process not found'))
        }
      })
    })
  }
}

export default ProcessHandlerWin
