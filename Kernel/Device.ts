import { v4 as uuidv4 } from 'uuid'

export interface DeviceProps {
    name?: string
    id?: string
}

export class Device {
    private static dCount = 0
    private id: string
    private name: string
    constructor(props?: DeviceProps) {
        this.name = ((props != null) && props.name) || ('Device' + (Device.dCount++).toString())
        this.id = ((props != null) && props.id) || uuidv4().replace('-', '')
    }

    public Run(command: string): Promise<any> {
        return new Promise<any>((resolve) => {
            console.log(command);
            resolve(true);
        })
    }

    public GetId(): string {
        return this.id
    }

    protected SetId(id: string): void {
        this.id = id
    }

    public GetName(): string {
        return this.name
    }

    protected SetName(name: string): void {
        this.name = name
    }

    public static buildDevice(): Device {
        return new Device({})
    }
}
