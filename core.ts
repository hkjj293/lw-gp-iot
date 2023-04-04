import { Device } from "./Device";
import { Service } from "./Service";

export type Task = {
    id: string,
    deviceId: string,
    command: string,
}

export class Core {
    private system_states: {
        devices: { [uuid: string]: Device },
        taskQueue: Task[],
        operating_status: string,
        in_running: number,
    };

    public constructor() {
        this.system_states = {
            devices: {},
            taskQueue: [],
            operating_status: "stopped",
            in_running: 0,
        }
    }

    public addDevice(uuid: string, device: Device): void {
        this.system_states.devices[uuid] = device;
    }

    public getDevice(uuid: string): Device | null {
        return this.system_states.devices[uuid];
    }

    public async Run(): Promise<void> {
        if (this.system_states.in_running >= 1) {
            return;
        }
        this.system_states.in_running += 1;
        this.system_states.operating_status = "running";
        while (this.system_states.taskQueue.length > 0) {
            try {
                const task = this.system_states.taskQueue.shift();
                if (task) this.system_states.devices[task.deviceId].Run(task.command);
            } catch (e) {
                console.log((e as Error).message);
            }
        }
        if (this.system_states.operating_status == "running") {
            setImmediate(() => {
                this.system_states.in_running -= 1;
                this.Run()
            });
        }
    }
}
