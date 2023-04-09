"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const CoreCmd_1 = require("./CoreCmd");
const uuid_1 = require("uuid");
class Core {
    constructor() {
        this.system_states = {
            id: (0, uuid_1.v4)().replace('-', ''),
            devices: {},
            taskQueue: [],
            operatingStatus: "stopped",
            cyclePeriod: 0,
            inRunning: 0,
            states: {}
        };
    }
    getId() {
        return this.system_states.id;
    }
    addDevice(device) {
        this.system_states.devices[device.GetId()] = device;
    }
    removeDeviceById(uuid) {
        return delete this.system_states.devices[uuid];
    }
    getDeviceById(uuid) {
        return this.system_states.devices[uuid];
    }
    getAllDevices() {
        return this.system_states.devices;
    }
    addTask(task) {
        this.system_states.taskQueue.push(task);
    }
    getOperatingStatus() {
        return this.system_states.operatingStatus;
    }
    setOperatingStatus(opStatus) {
        this.system_states.operatingStatus = opStatus;
    }
    getCyclePeriod() {
        return this.system_states.cyclePeriod;
    }
    setCyclePeriod(period) {
        this.system_states.cyclePeriod = period;
    }
    getCoreStates() {
        return this.system_states.states;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('new Cycle ' + new Date().toISOString());
            if (this.system_states.inRunning >= 1) {
                return;
            }
            this.system_states.inRunning += 1;
            this.system_states.operatingStatus = "running";
            while (this.system_states.taskQueue.length > 0) {
                try {
                    const task = this.system_states.taskQueue.shift();
                    if (task && this.system_states.devices[task.deviceId]) {
                        this.system_states.devices[task.deviceId].Run(task.command);
                    }
                    else if (task && task.deviceId == this.system_states.id) {
                        this.runCommand(task.command);
                    }
                }
                catch (e) {
                    console.log(e.message);
                }
            }
            if (this.system_states.operatingStatus == "running") {
                if (this.system_states.cyclePeriod == 0) {
                    setImmediate(() => {
                        this.system_states.inRunning -= 1;
                        this.run();
                    });
                }
                else {
                    setTimeout(() => {
                        this.system_states.inRunning -= 1;
                        this.run();
                    }, this.system_states.cyclePeriod);
                }
            }
        });
    }
    runCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = command.split(';');
            if (c[0] && c[0].length > 0 && CoreCmd_1.CoreCmd.fns[c[0]]) {
                const res = CoreCmd_1.CoreCmd.fns[c[0]](this, command);
            }
        });
    }
}
exports.Core = Core;
