import { type Core } from './Core'

export type CmdFn = Record<string, (core: Core, cmd: string) => Promise<any>>

export class CoreCmd {
    public static fns: CmdFn = {
        cp: cp,
        term: term,
        echo: echo,
        now: now,
    }
}

function cp(core: Core, cmd: string) {
    return new Promise((resolve) => {
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
        resolve(true)
    })
}

function term(core: Core, cmd: string) {
    return new Promise((resolve) => {
        const cmdFrag = cmd.split(';')
        if (cmdFrag[1]) {
            let p = 0
            if (cmdFrag[1]) {
                try {
                    p = parseInt(cmdFrag[1])
                } catch (e) {
                    p = 0
                }
            }
            setTimeout(() => { core.setOperatingStatus('stop') }, p)
        } else {
            core.setOperatingStatus('stop')
        }
        resolve(true)
    })
}

function echo(core: Core, cmd: string) {
    return new Promise((resolve) => {
        const cmdFrag = cmd.split(';')
        console.log('echo >> ' + cmdFrag[1]);
        resolve(true)
    })
}

function now(core: Core, cmd: string) {
    return new Promise((resolve) => {
        const d = new Date()
        const dd = new Date(Date.now() - 1000 * 60 * d.getTimezoneOffset())
        console.log('date >> ' + dd.toUTCString());
        resolve(true)
    })
}
