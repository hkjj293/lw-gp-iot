import { type Device } from './Device'
import { v4 as uuidv4 } from 'uuid'

export interface ServiceProps {
  name?: string
  id?: string
}

export class Service {
  private static dCount = 0
  private readonly id: string
  private readonly name: string
  constructor (props?: ServiceProps) {
    this.name = ((props != null) && props.name) || ('Service' + (Service.dCount++).toString())
    this.id = ((props != null) && props.id) || uuidv4().replace('-', '')
  }

  public GetAllDevices (): Device[] {
    return []
  }
}
