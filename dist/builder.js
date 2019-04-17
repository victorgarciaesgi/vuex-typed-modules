"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = __importDefault(require("../../vuex"));
var vue_1 = __importDefault(require("../../vue"));
var hotModule_1 = require("./hotModule");
var ts_optchain_1 = require("ts-optchain");
vue_1.default.use(vuex_1.default);
var storeBuilder = null;
exports.storeBuilder = storeBuilder;
var storedModules = {};
exports.storedModules = storedModules;
function createModuleTriggers(moduleName) {
    function commit(name) {
        return function (payload) { return storeBuilder.commit(moduleName + "/" + name, payload); };
    }
    function dispatch(name) {
        return function (payload) { return storeBuilder.dispatch(moduleName + "/" + name, payload); };
    }
    function read(name) {
        return function () { return ts_optchain_1.oc(storeBuilder).getters[moduleName + "/" + name](); };
    }
    return {
        commit: commit,
        dispatch: dispatch,
        read: read,
        get state() {
            return function () { return storeBuilder.state[moduleName]; };
        }
    };
}
function stateBuilder(state, name) {
    var b = createModuleTriggers(name);
    var registerMutations = function (mutations) {
        var renderedMutations = {};
        if (mutations) {
            Object.keys(mutations).map(function (key) {
                renderedMutations[key] = b.commit(key);
            });
        }
        return renderedMutations;
    };
    var registerActions = function (actions) {
        var renderedActions = {};
        if (actions) {
            Object.keys(actions).map(function (key) {
                renderedActions[key] = b.dispatch(key);
            });
        }
        return renderedActions;
    };
    var registerGetters = function (getters) {
        var renderedGetters = {};
        if (getters) {
            Object.keys(getters).map(function (key) {
                Object.defineProperty(renderedGetters, key, {
                    get: function () {
                        return b.read(key)();
                    }
                });
            });
        }
        return renderedGetters;
    };
    return {
        registerMutations: registerMutations,
        registerActions: registerActions,
        registerGetters: registerGetters,
        state: b.state
    };
}
exports.stateBuilder = stateBuilder;
function defineModule(name, state, vuexModule) {
    if (!vuexModule.mutations)
        vuexModule.mutations = {};
    vuexModule.mutations.resetState = function (moduleState) {
        Object.keys(state).map(function (key) {
            vue_1.default.set(moduleState, key, state[key]);
        });
    };
    vuexModule.mutations.updateState = function (moduleState, params) {
        Object.keys(params).map(function (key) {
            vue_1.default.set(moduleState, key, params[key]);
        });
    };
    if (module.hot) {
        hotModule_1.enableHotReload(name, state, vuexModule);
    }
    else {
        storedModules[name] = __assign({ namespaced: true, state: state }, vuexModule);
    }
    var _a = stateBuilder(state, name), registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, registerActions = _a.registerActions, newState = _a.state;
    return {
        mutations: registerMutations(vuexModule.mutations),
        actions: registerActions(vuexModule.actions),
        getters: registerGetters(vuexModule.getters),
        resetState: function () {
            storeBuilder.commit(name + "/resetState");
        },
        updateState: function (params) {
            storeBuilder.commit(name + "/updateState", params);
        },
        get state() {
            return newState();
        }
    };
}
exports.defineModule = defineModule;
function createStore(_a) {
    var _b = _a.strict, strict = _b === void 0 ? false : _b, options = __rest(_a, ["strict"]);
    exports.storeBuilder = storeBuilder = new vuex_1.default.Store(__assign({ strict: strict }, options, { modules: storedModules }));
    storeBuilder.subscribeAction({
        before: function (action, state) {
            var moduleName = action.type.split("/")[0];
            var type = action.type.split("/")[1];
            console.groupCollapsed("%c Vuex Action %c " + moduleName + " %c " + type + " %c", "background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff", "background:#fff;padding: 1px;color: #451382", "background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff", "background:transparent");
            console.log("PAYLOAD", action.payload);
            console.log("STATE", state);
            console.groupEnd();
        }
    });
    return storeBuilder;
}
exports.createStore = createStore;
