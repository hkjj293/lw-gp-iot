"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreCmd = void 0;
class CoreCmd {
}
CoreCmd.fns = {
    cp: (core, cmd) => {
        const cmdFrag = cmd.split(';');
        var p = 0;
        if (cmdFrag[1]) {
            try {
                p = parseInt(cmdFrag[1]);
            }
            catch (e) {
                p = 0;
            }
        }
        core.setCyclePeriod(p);
    }
};
exports.CoreCmd = CoreCmd;
