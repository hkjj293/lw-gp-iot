/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';
import 'fs/promises'

import { Core } from "./core";
import MerossService from "./Services/Meross/MerossService";

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
    console.log('Done Init: ' + JSON.stringify(obj) + '\n')
    setImmediate(() => { core.Run() });
    console.log('Running Async Core');
}

main();