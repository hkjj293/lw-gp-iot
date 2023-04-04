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
class Core {
    constructor() {
        this.system_states = {
            devices: {},
            taskQueue: [],
            operating_status: "stopped",
            in_running: 0,
        };
    }
    addDevice(uuid, device) {
        this.system_states.devices[uuid] = device;
    }
    getDevice(uuid) {
        return this.system_states.devices[uuid];
    }
    Run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.system_states.in_running >= 1) {
                return;
            }
            this.system_states.in_running += 1;
            this.system_states.operating_status = "running";
            while (this.system_states.taskQueue.length > 0) {
                try {
                    const task = this.system_states.taskQueue.shift();
                    if (task)
                        this.system_states.devices[task.deviceId].Run(task.command);
                }
                catch (e) {
                    console.log(e.message);
                }
            }
            if (this.system_states.operating_status == "running") {
                setImmediate(() => {
                    this.system_states.in_running -= 1;
                    this.Run();
                });
            }
        });
    }
}
exports.Core = Core;
