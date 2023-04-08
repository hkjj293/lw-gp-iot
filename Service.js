"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const uuid_1 = require("uuid");
class Service {
    constructor(props) {
        this.name = (props && props.name) || ("Service" + (Service.dCount++).toString());
        this.id = (props && props.id) || (0, uuid_1.v4)();
    }
    GetAllDevices() {
        return [];
    }
}
Service.dCount = 0;
exports.Service = Service;
