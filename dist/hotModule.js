"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
function enableHotReload(name, state, vuexModule, dynamic) {
    if (module.hot) {
        module.hot.accept();
        if (builder_1.storeBuilder.storedModules[name] == null && !dynamic) {
            builder_1.storeBuilder.storeModule(name, state, vuexModule);
        }
        else if (builder_1.storeBuilder.storedModules[name] != null) {
            builder_1.storeBuilder.storeModule(name, state, vuexModule);
            builder_1.storeBuilder.hotUpdate();
            console.log("%c vuex-typed-modules %c " + (dynamic ? "Dynamic" : "") + " Module '" + name + "' hot reloaded %c", "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff", "background:#d64a17 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff", "background:transparent");
        }
    }
}
exports.enableHotReload = enableHotReload;
function disableHotReload(name) {
    builder_1.storeBuilder.deleteStoreModule(name);
}
exports.disableHotReload = disableHotReload;
