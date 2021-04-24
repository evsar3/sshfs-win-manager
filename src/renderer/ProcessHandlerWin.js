import { exec, spawn } from 'child_process'

import { dirname } from 'path'
import { existsSync as fileExistsSync } from 'fs'

class ProcessHandlerWin {
  constructor (settings) {
    this.settings = settings
  }

  create (conn) {
    return new Promise((resolve, reject) => {
      if (this.settings.sshfsBinary.endsWith('sshfs-win.exe')) {
        this.settings.sshfsBinary = this.settings.sshfsBinary.replace(/sshfs-win\.exe$/, 'sshfs.exe')
      }

      let cmdArgs = [
        `${conn.user}@${conn.host}:${conn.folder}`,
        conn.mountPoint,
        `-p${conn.port}`,
        `-ovolname=${conn.name.substr(0, 32)}`,
        '-odebug',
        '-ologlevel=debug1',
        '-oStrictHostKeyChecking=no',
        '-oUserKnownHostsFile=/dev/null'
      ]

      if (!fileExistsSync(this.settings.sshfsBinary)) {
        reject(new Error(`SSHFS binary not found at "${this.settings.sshfsBinary}". Check your settings`)); return
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
      } else {
        cmdArgs = [
          ...cmdArgs,
          ...[
            '-oidmap=user',
            '-ouid=-1',
            '-ogid=-1',
            '-oumask=000',
            '-ocreate_umask=000',
            '-omax_readahead=1GB',
            '-oallow_other',
            '-olarge_read',
            '-okernel_cache',
            '-ofollow_symlinks'
          ]
        ]
      }

      if (conn.advanced.reconnect && (!conn.advanced.customCmdlOptionsEnabled && !conn.advanced.customCmdlOptions.includes('-oreconnect'))) {
        cmdArgs.push('-oreconnect')
      }

      if (conn.authType === 'password' || conn.authType === 'password-ask') {
        cmdArgs.push('-oPreferredAuthentications=password')
        cmdArgs.push('-opassword_stdin')
      }

      if (conn.authType === 'key-file') {
        cmdArgs.push('-oPreferredAuthentications=publickey')
        cmdArgs.push(`-oIdentityFile="${conn.keyFile.replace(/\\/g, '/')}"`)
      }

      console.log('-'.repeat(80))
      console.log('date:', new Date().toISOString())
      console.log('conn:', `{${conn.uuid}}`, `(${conn.name})`)
      console.log('conntype:', conn.authType)
      console.log('cmd:', `"${this.settings.sshfsBinary}" ${cmdArgs.join(' ')}`)

      const process = spawn(this.settings.sshfsBinary, cmdArgs, {
        env: {
          PATH: dirname(this.settings.sshfsBinary)
        }
      })

      if (conn.authType === 'password' || conn.authType === 'password-ask') {
        process.stdin.write(conn.password + '\n')
      }

      process.stdout.on('data', data => {
        console.log(`{${conn.uuid}} stdout:`, data.toString())
      })

      let debugOutput = ''
      let lastDebugMessage = ''

      process.stderr.on('data', data => {
        data = data.toString().trim()

        console.log(`{${conn.uuid}} stderr:`, data)

        debugOutput += data
        debugOutput = debugOutput.substr(-512)
        lastDebugMessage = data

        if (data.includes('service sshfs has been started')) {
          resolve(process)
        }
      })

      process.on('close', exitCode => {
        console.log(`{${conn.uuid}}`, 'exit:', exitCode)

        if (debugOutput.includes('no such identity')) {
          reject(new Error('Private key not found: ' + conn.keyFile))
        }

        if (debugOutput.includes('mount point in use')) {
          reject(new Error('Mount point in use'))
        }

        if (debugOutput.includes('Permission denied')) {
          if (conn.authType === 'key-file') {
            reject(new Error('Invalid user name'))
          } else {
            reject(new Error('Invalid user name or password'))
          }
        }

        if (debugOutput.includes('Permission denied')) {
          reject(new Error('Invalid user name or password'))
        }

        reject(new Error(lastDebugMessage))
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
