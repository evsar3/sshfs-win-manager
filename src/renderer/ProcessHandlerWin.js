import { spawn, exec } from 'child_process'
import fs from 'fs'

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

      if (!fs.existsSync(this.settings.sshfsBinary)) {
        reject(new Error(`SSHFS-Win binary not found at "${this.settings.sshfsBinary}". Check your settings`)); return
      }

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

      if (conn.authType === 'password' || conn.authType === 'password-ask') {
        cmdArgs.push('-oPreferredAuthentications=password')
        cmdArgs.push('-opassword_stdin')
      }

      if (conn.authType === 'key-file') {
        cmdArgs.push('-oPreferredAuthentications=publickey')
        cmdArgs.push(`-oIdentityFile="${conn.keyFile.replace(/\\/g, '/')}"`)
      }

      const childProcess = spawn(this.settings.sshfsBinary, cmdArgs)

      if (conn.authType === 'password' || conn.authType === 'password-ask') {
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

  getLastSpawnedProcess () {
    return new Promise((resolve, reject) => {
      exec(`wmic process where '(name="sshfs.exe")' get processid, creationdate /value`, (err, stdout) => {
        if (!err) {
          let data = stdout.toString().trim().split('\n')
          let pid = null
          let creationDate = null

          data.forEach(item => {
            let itemParts = item.split('=')

            let key = itemParts[0].trim().toLowerCase()
            let value = itemParts[1].trim().toLowerCase()

            if (key === 'processid') {
              pid = parseInt(value)
            }

            if (key === 'creationdate') {
              let year = parseInt(value.substr(0, 4))
              let month = parseInt(value.substr(4, 2)) - 1
              let day = parseInt(value.substr(6, 2))
              let hours = parseInt(value.substr(8, 2))
              let minutes = parseInt(value.substr(10, 2))
              let seconds = parseInt(value.substr(13, 2))

              creationDate = new Date(year, month, day, hours, minutes, seconds)
            }
          })

          resolve({ pid, creationDate })
        } else {
          reject(new Error('Process not found'))
        }
      })
    })
  }
}

export default ProcessHandlerWin
