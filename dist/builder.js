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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = __importDefault(require("vuex"));
var vue_1 = __importDefault(require("vue"));
vue_1.default.use(vuex_1.default);
var storeBuilder = new vuex_1.default.Store({});
exports.storeBuilder = storeBuilder;
var storedModules = {};
function createModuleTriggers(name, initialState) {
    function commit(handler) {
        return function (payload) { return storeBuilder.commit(name + "/" + handler.name, payload); };
    }
    function dispatch(handler) {
        return function (payload) { return storeBuilder.dispatch(name + "/" + handler.name, payload); };
    }
    function read(handler) {
        return function () { return storeBuilder.getters[name + "/" + handler.name]; };
    }
    return {
        commit: commit,
        dispatch: dispatch,
        read: read,
        get state() {
            return storeBuilder.state[name];
        }
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
    storeBuilder.registerModule(name, __assign({ namespaced: true, state: state }, vuexModule));
    storedModules[name] = __assign({ state: state }, vuexModule);
    if (module.hot) {
    }
    var _a = stateBuilder(state, name), registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, registerActions = _a.registerActions, newState = _a.state;
    return {
        mutations: registerMutations(vuexModule.mutations),
        actions: registerActions(vuexModule.actions),
        getters: registerGetters(vuexModule.getters),
        get state() {
            return newState;
        }
    };
}
exports.defineModule = defineModule;
