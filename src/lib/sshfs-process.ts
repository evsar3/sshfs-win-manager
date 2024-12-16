import { Connection } from '../store/connections'
import { Settings, useSettingsStore } from '../store/settings'

export class SshfsProcess {
  public pid: number | null = null
  public settings: Settings

  constructor(public connection: Connection) {
    this.settings = useSettingsStore().settings
  }

  async run(): Promise<this> {
    return Promise.resolve(this)
  }

  async exists(): Promise<boolean> {
    return Promise.resolve(false)
  }

  async stop(): Promise<void> {
    return Promise.resolve()
  }
}
