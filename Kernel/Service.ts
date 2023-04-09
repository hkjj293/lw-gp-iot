import { Device } from "./Device";
import { v4 as uuidv4 } from 'uuid';

export type ServiceProps = {
    name?: string,
    id?: string,
}

export class Service {
    private static dCount = 0;
    private id: string;
    private name: string;
    constructor(props?: ServiceProps) {
        this.name = (props && props.name) || ("Service" + (Service.dCount++).toString());
        this.id = (props && props.id) || uuidv4().replace('-', '')
    }

    public GetAllDevices(): Device[] {
        return [];
    }
}