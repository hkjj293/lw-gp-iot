/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("fs/promises");
const core_1 = require("./core");
const MerossService_1 = __importDefault(require("./Services/Meross/MerossService"));
const https_1 = __importDefault(require("https"));
var nightLight = false;
/* The idea is subscibe a service and get device from service.
A service means a 3rd party api that can used to fetch devices, read devices and control devices.
The core system should be logically isolated from device & service registry*/
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
        const core = new core_1.Core();
        const meross = new MerossService_1.default();
        // "meross": "MerossService" => in services.json => e.g. Core.addService('meross');
        // in ./{service_name}/ folder, there will be service files
        const init = yield meross.init(verbose);
        const obj = meross.getDevicesData();
        const devices = meross.getDevices();
        for (const d in devices) {
            core.addDevice(devices[d]);
        }
        console.log('Done Init: ' + JSON.stringify(obj) + '\n');
        setImmediate(() => { core.Run(); });
        console.log('Running Async Core');
        setImmediate(() => { schedule(core); });
    });
}
function schedule(core) {
    return __awaiter(this, void 0, void 0, function* () {
        const LATITUDE = '52.42';
        const LONGITUDE = '-1.96';
        const d = new Date();
        const ss = yield new Promise((resolve) => {
            https_1.default.get('https://api.sunrise-sunset.org/json?lat=' + LATITUDE + '&lng=' + LONGITUDE + '&formatted=0', (res) => {
                var body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    resolve(JSON.parse(body));
                });
            });
        });
        // PLease refer to https://sunrise-sunset.org/api
        const sunset = new Date(Date.parse(ss.results.sunset) - 1000 * 60 * 30);
        console.log(sunset);
        console.log(d);
        if (!nightLight && d.getTime() > sunset.getTime()) {
            console.log('add time');
            core.addTask({
                id: '2209059936342954060248e1e9a51e71',
                deviceId: '2209059936342954060248e1e9a51e71',
                command: 't;3;t'
            });
            nightLight = true;
        }
        if (core.getOperatingStatus() == "running") {
            setImmediate(() => { schedule(core); });
        }
    });
}
main();
