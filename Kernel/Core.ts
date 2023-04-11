import type { Device } from './Device'
import { CoreCmd } from './CoreCmd'
import { v4 as uuidv4 } from 'uuid'

// Active task->run immidiately when command sent to core,
// Passive task->run when certain conditions satisfied
export interface Task {
    id: string
    deviceId: string
    command: string
}

export class Core {
    private readonly system_states: {
        id: string
        devices: Record<string, Device>
        taskQueue: Task[]
        operatingStatus: string
        cyclePeriod: number
        inRunning: number
        states: any
    }

    public constructor() {
        this.system_states = {
            id: uuidv4().replace('-', ''),
            devices: {},
            taskQueue: [],
            operatingStatus: 'stopped',
            cyclePeriod: 0,
            inRunning: 0,
            states: {}
        }
    }

    public getId(): string {
        return this.system_states.id
    }

    public addDevice(device: Device): void {
        this.system_states.devices[device.GetId()] = device
    }

    public removeDeviceById(uuid: string): boolean {
        return delete this.system_states.devices.uuid
    }

    public getDeviceById(uuid: string): Device | null {
        return this.system_states.devices[uuid]
    }

    public getAllDevices(): Record<string, Device> | null {
        return this.system_states.devices
    }

    public addTask(task: Task): void {
        this.system_states.taskQueue.push(task)
    }

    public getOperatingStatus(): string {
        return this.system_states.operatingStatus
    }

    public setOperatingStatus(opStatus: string): void {
        this.system_states.operatingStatus = opStatus
    }

    public getCyclePeriod(): number {
        return this.system_states.cyclePeriod
    }

    public setCyclePeriod(period: number): void {
        this.system_states.cyclePeriod = period
    }

    public getCoreStates(): any {
        return this.system_states.states
    }

    public async run(start: boolean = true): Promise<void> {
        if (start) {
            this.system_states.operatingStatus = 'running'
        }
        if (this.system_states.inRunning >= 1) {
            return
        }
        this.system_states.inRunning += 1
        while (this.system_states.operatingStatus === 'running' &&
            this.system_states.taskQueue.length > 0) {
            try {
                const task = this.system_states.taskQueue.shift()
                if ((task !== undefined) && this.system_states.devices[task.deviceId]) {
                    this.system_states.devices[task.deviceId].Run(task.command)
                } else if ((task !== undefined) && task.deviceId === this.system_states.id) {
                    this.runCommand(task.command)
                }
            } catch (e) {
                console.log((e as Error).message)
            }
        }
        if (this.system_states.operatingStatus === 'running') {
            if (this.system_states.cyclePeriod === 0) {
                setImmediate(async () => {
                    this.system_states.inRunning -= 1
                    await this.run(false)
                })
            } else {
                setTimeout(async () => {
                    this.system_states.inRunning -= 1
                    await this.run(false)
                }, this.system_states.cyclePeriod)
            }
        } else {
            console.log('terminated')
        }
    }

    public async runCommand(command: string) {
        const c: string[] = command.split(';')
        if (c[0] && c[0].length > 0 && CoreCmd.fns[c[0]]) {
            const res = await CoreCmd.fns[c[0]](this, command)
        }
    }
}
