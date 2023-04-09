"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const uuid_1 = require("uuid");
class Device {
    constructor(props) {
        this.name = (props && props.name) || ("Device" + (Device.dCount++).toString());
        this.id = (props && props.id) || (0, uuid_1.v4)().replace('-', '');
    }
    Run(command) {
        console.log(command);
    }
    GetId() {
        return this.id;
    }
    SetId(id) {
        this.id = id;
    }
    GetName() {
        return this.name;
    }
    static buildDevice() {
        return new Device({});
    }
}
Device.dCount = 0;
exports.Device = Device;
