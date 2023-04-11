/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict'
import 'fs/promises'

import { Core } from '../Kernel/Core'
import MerossService from '../Services/Meross/MerossService'
import https from 'https'

import { v4 as uuidv4 } from 'uuid'

let nightLight = false
const toggle = false
const trigger = false
const trig = false

/* The idea is subscibe a service and get device from service.
A service means a 3rd party api that can used to fetch devices, read devices and control devices.
The core system should be logically isolated from device & service registry */
async function main() {
    const verbose = process.argv.includes('--verbose') || process.argv.includes('-v')
    const core = new Core()
    const meross = new MerossService()
    // "meross": "MerossService" => in services.json => e.g. Core.addService('meross');
    // in ./{service_name}/ folder, there will be service files

    const init = await meross.init(verbose)
    const obj = meross.getDevicesData()
    const devices = meross.getDevices()
    for (const d in devices) {
        core.addDevice(devices[d])
    }
    console.log('Done Init: ' + JSON.stringify(obj) + '\n')
    core.setCyclePeriod(1000);
    setImmediate(() => { core.run() })
    setImmediate(() => { schedule(core) })
    console.log('Running Async Core')
    // core.on('term',()=>{serviceRegistry.close()})
    // meross.close();
}

async function schedule(core: Core) {
    const LATITUDE = '1.17'
    const LONGITUDE = '103.51'
    const d = new Date()
    const ss = await new Promise<any>((resolve) => {
        try {
            https.get(
                'https://api.sunrise-sunset.org/json?lat=' + LATITUDE + '&lng=' + LONGITUDE + '&formatted=0',
                (res) => {
                    let body = ''
                    res.on('data', function (chunk) {
                        body += chunk
                    })
                    res.on('end', function () {
                        resolve(JSON.parse(body))
                    })
                })
        } catch (e) {

        }
    })
    // PLease refer to https://sunrise-sunset.org/api
    const sunset = new Date(Date.parse(ss.results.sunset) + 1000 * 60 * (-30 - d.getTimezoneOffset()))
    const dd = new Date(Date.now() - 1000 * 60 * d.getTimezoneOffset())
    if (!nightLight && dd.getTime() > sunset.getTime()) {
        console.log('add time')
        core.addTask({
            id: uuidv4().replace('-', ''),
            deviceId: '<your device ID>',
            command: 't;3;t'
        })
        nightLight = true
    }
    // if (dd.getSeconds() >= 30 && !trigger) {
    //     trigger = true;
    //     core.addTask({
    //         id: uuidv4().replace('-', ''),
    //         deviceId: '<your device ID>',
    //         command: 't;3;' + (toggle ? 't' : 'f')
    //     });
    //     toggle = !toggle;
    // } else if (dd.getSeconds() < 30 && trigger) {
    //     trigger = false;
    // }
    // core.addTask({
    //     id: uuidv4().replace('-', ''),
    //     deviceId: core.getId(),
    //     command: 'cp;' + (40 * dd.getSeconds()).toString()
    // })
    // core.addTask({
    //     id: uuidv4().replace('-', ''),
    //     deviceId: core.getId(),
    //     command: 'echo;NewCycle'
    // })
    core.addTask({
        id: uuidv4().replace('-', ''),
        deviceId: core.getId(),
        command: 'now'
    })
    // core.addTask({
    //     id: uuidv4().replace('-', ''),
    //     deviceId: core.getId(),
    //     command: 'term;3000'
    // })
    if (core.getOperatingStatus() == 'running') {
        if (core.getCyclePeriod() == 0) {
            setImmediate(() => { schedule(core) })
        } else {
            setTimeout(() => { schedule(core) }, core.getCyclePeriod())
        }
    }
}

main()
