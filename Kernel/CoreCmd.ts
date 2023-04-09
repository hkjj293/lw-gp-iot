import { type Core } from './Core'

export type CmdFn = Record<string, (core: Core, cmd: string) => any>

export class CoreCmd {
  public static fns: CmdFn = {
    cp: (core: Core, cmd: string) => {
      const cmdFrag = cmd.split(';')
      let p = 0
      if (cmdFrag[1]) {
        try {
          p = parseInt(cmdFrag[1])
        } catch (e) {
          p = 0
        }
      }
      core.setCyclePeriod(p)
    },
    term: (core: Core, cmd: string) => {
      const cmdFrag = cmd.split(';')
      if (cmdFrag[1]) {
        setTimeout(() => { core.setOperatingStatus('stop') }, parseInt(cmdFrag[1]))
      } else {
        core.setOperatingStatus('stop')
      }
    }
  }
}
