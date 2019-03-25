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
Object.defineProperty(exports, "__esModule", { value: true });
var hotModule_1 = require("./hotModule");
var ts_optchain_1 = require("ts-optchain");
var storeConstructor = (function () {
    function storeConstructor() {
        this.storedModules = {};
    }
    storeConstructor.prototype.Store = function (storeConstructor) {
        this._store = new storeConstructor({
            modules: this.storedModules
        });
        return this._store;
    };
    storeConstructor.prototype.storeModule = function (name, state, vuexModule) {
        this.storedModules[name] = __assign({ namespaced: true, state: state }, vuexModule);
    };
    storeConstructor.prototype.deleteStoreModule = function (name) {
        delete this.storedModules[name];
    };
    Object.defineProperty(storeConstructor.prototype, "state", {
        get: function () {
            return ts_optchain_1.oc(this._store).state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(storeConstructor.prototype, "getters", {
        get: function () {
            return ts_optchain_1.oc(this._store).getters;
        },
        enumerable: true,
        configurable: true
    });
    storeConstructor.prototype.commit = function (fnName, payload) {
        ts_optchain_1.oc(this._store).commit(function () { })(fnName, payload);
    };
    storeConstructor.prototype.dispatch = function (fnName, payload) {
        ts_optchain_1.oc(this._store).dispatch()(fnName, payload);
    };
    storeConstructor.prototype.registerModule = function (name, state, modules) {
        if (this._store) {
            this._store.registerModule(name, __assign({ namespaced: true, state: state }, modules));
        }
    };
    storeConstructor.prototype.unregisterModule = function (name) {
        ts_optchain_1.oc(this._store).unregisterModule(function () { })(name);
    };
    storeConstructor.prototype.hotUpdate = function () {
        if (this._store) {
            this._store.hotUpdate({
                modules: __assign({}, this.storedModules)
            });
        }
    };
    return storeConstructor;
}());
var storeBuilder = new storeConstructor();
exports.storeBuilder = storeBuilder;
function functionNameError() {
    throw new Error("Function name not supported.\n  Causes: \n    -Production build with Uglyfication (see Readme)\n    -Arrow functions\n    -Old browser that don't supports function name");
}
function createModuleTriggers(name, initialState) {
    function commit(handler) {
        if (!handler.name) {
            functionNameError();
        }
        else {
            return function (payload) { return storeBuilder.commit(name + "/" + handler.name, payload); };
        }
    }
    function dispatch(handler) {
        if (!handler.name) {
            functionNameError();
        }
        else {
            return function (payload) {
                return storeBuilder.dispatch(name + "/" + handler.name, payload);
            };
        }
    }
    function read(handler) {
        if (!handler.name) {
            functionNameError();
        }
        else {
            return function () { return storeBuilder.getters[name + "/" + handler.name](); };
        }
    }
    function state() {
        return function () { return storeBuilder.state[name](); };
    }
    return {
        commit: commit,
        dispatch: dispatch,
        read: read,
        state: state
    };
}
function stateBuilder(state, name) {
    var b = createModuleTriggers(name, state);
    var registerMutations = function (mutations) {
        var renderedMutations = {};
        if (mutations) {
            Object.keys(mutations).map(function (m) {
                renderedMutations[m] = b.commit(mutations[m]);
            });
        }
        return renderedMutations;
    };
    var registerActions = function (actions) {
        var renderedActions = {};
        if (actions) {
            Object.keys(actions).map(function (m) {
                renderedActions[m] = b.dispatch(actions[m]);
            });
        }
        return renderedActions;
    };
    var registerGetters = function (getters) {
        var renderedGetters = {};
        if (getters) {
            Object.keys(getters).map(function (m) {
                Object.defineProperty(renderedGetters, m, {
                    get: function () {
                        return b.read(getters[m])();
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
    hotModule_1.enableHotReload(name, state, vuexModule);
    storeBuilder.storeModule(name, state, vuexModule);
    var _a = stateBuilder(state, name), registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, registerActions = _a.registerActions, newState = _a.state;
    return {
        mutations: registerMutations(vuexModule.mutations),
        actions: registerActions(vuexModule.actions),
        getters: registerGetters(vuexModule.getters),
        get state() {
            return newState()();
        }
    };
}
exports.defineModule = defineModule;
