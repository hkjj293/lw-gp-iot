/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';
import 'fs/promises'

import { Core } from "./core";
import MerossService from "./Services/Meross/MerossService";
import https from 'https';

var nightLight = false;

/* The idea is subscibe a service and get device from service. 
A service means a 3rd party api that can used to fetch devices, read devices and control devices.
The core system should be logically isolated from device & service registry*/
async function main() {
    const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
    const core = new Core();
    const meross = new MerossService();
    // "meross": "MerossService" => in services.json => e.g. Core.addService('meross');
    // in ./{service_name}/ folder, there will be service files

    const init = await meross.init(verbose);
    const obj = meross.getDevicesData();
    const devices = meross.getDevices();
    for (const d in devices) {
        core.addDevice(devices[d]);
    }
    console.log('Done Init: ' + JSON.stringify(obj) + '\n')
    setImmediate(() => { core.Run() });
    console.log('Running Async Core');
    setImmediate(() => { schedule(core) });
}

async function schedule(core: Core) {
    const LATITUDE = '52.42';
    const LONGITUDE = '-1.96';
    const d = new Date();
    const ss = await new Promise<any>((resolve) => {
        https.get(
            'https://api.sunrise-sunset.org/json?lat=' + LATITUDE + '&lng=' + LONGITUDE + '&formatted=0',
            (res) => {
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
        setImmediate(() => { schedule(core) });
    }
}

main();