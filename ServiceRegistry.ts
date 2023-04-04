import { Service, ServiceProps } from "./Service";
import fs from 'fs/promises';
import { Device } from "./Device";

export type RegistryRecord = { [name: string]: { service: Service, device: Device } };

export class ServiceRegistry {

    private services: RegistryRecord;

    constructor() {
        this.services = {};
        this.Init();
    }

    public async Init() {
        this.services = await this.FindAllServices();
    }

    public AddService(prop: ServiceProps): boolean {
        return true;
    }

    public GetAllServices(): RegistryRecord {
        return this.services;
    }

    private async FindAllServices(): Promise<RegistryRecord> {
        var servicesFound: RegistryRecord = {};
        var servicesJson: string = await fs.readFile('./Service/services.json', "ascii");
        var services = JSON.parse(servicesJson);
        for (const key in services) {
            const folder = services[key]['folder'];
            const serviceName = services[key]['service'];
            const service: Service = await require('./' + folder + '/' + serviceName);
            const deviceName = services[key]['service'];
            const device: Device = await require('./' + folder + '/' + deviceName);
            servicesFound[key] = { service, device };
        }
        return servicesFound;
    }
}