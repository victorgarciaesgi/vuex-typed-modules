"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Helpers_1 = require("./Helpers");
var Database = (function () {
    function Database(options) {
        this.modules = [];
        this.options = options;
    }
    Database.prototype.install = function (vuexModules) {
        var _this = this;
        vuexModules.forEach(function (vuexmodule) {
            var _a = vuexmodule.extract(), name = _a.name, actions = _a.actions, getters = _a.getters, mutations = _a.mutations, state = _a.state;
            if (_this.modules.find(function (mod) { return mod.name === name; })) {
                console.error("A module with the name " + name + " already exists");
                return;
            }
            if (mutations == null && mutations === undefined) {
                mutations = {};
                Helpers_1.setHelpers(mutations, state);
            }
            _this.store.registerModule(name, {
                namespaced: true,
                actions: actions,
                getters: getters,
                mutations: mutations,
                state: state
            });
            vuexmodule.register(_this.store);
        });
    };
    Database.prototype.deploy = function (vuexModules) {
        var _this = this;
        return function (store) {
            _this.store = store;
            _this.install(vuexModules);
            if (_this.options.logger)
                _this.createLogger();
        };
    };
    Database.prototype.createLogger = function () {
        this.store.subscribeAction({
            before: function (action, state) {
                var moduleName = action.type.split("/")[0];
                var type = action.type.split("/")[1];
                console.groupCollapsed("%c Vuex Action %c " + moduleName + " %c " + type + " %c", "background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff", "background:#fff;padding: 1px;color: #451382", "background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff", "background:transparent");
                console.log("PAYLOAD", action.payload);
                console.log("STATE", state);
                console.groupEnd();
            }
        });
    };
    return Database;
}());
exports.Database = Database;
