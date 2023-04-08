import { v4 as uuidv4 } from 'uuid';

export type DeviceProps = {
    name?: string,
    id?: string,
}

export class Device {
    private static dCount = 0;
    private id: string;
    private name: string;
    constructor(props?: DeviceProps) {
        this.name = (props && props.name) || ("Device" + (Device.dCount++).toString());
        this.id = (props && props.id) || uuidv4()
    }

    public Run(command: string) {
        console.log(command);
    }

    public GetId(): string {
        return this.id;
    }

    protected SetId(id: string): void {
        this.id = id;
    }

    public GetName(): string {
        return this.name;
    }

    public static buildDevice(): Device {
        return new Device({});
    }
}