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
const core_1 = require("./core");
const MerossService_1 = __importDefault(require("./MerossService"));
/* The idea is subscibe a service and get device from service. A service means a 3rd party api that can used to fetch devices, read devices and control devices*/
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
        const core = new core_1.Core();
        const meross = new MerossService_1.default();
        // "meross": "MerossService"
        const init = yield meross.init(verbose);
        const obj = meross.getDevicesData();
        console.log('Done Init: ' + JSON.stringify(obj) + '\n');
        setImmediate(() => { core.Run(); });
        console.log('Running Async Core');
    });
}
main();
