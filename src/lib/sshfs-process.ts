import { Connection } from '../store/connections'

export class SshfsProcess {
  public pid: number | null = null

  constructor(private connection: Connection) {}

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
