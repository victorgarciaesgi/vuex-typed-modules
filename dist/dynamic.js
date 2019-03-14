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
var _1 = require("./");
var registerDynamicModule = (function () {
    function registerDynamicModule(name, state, Vuexmodule) {
        this.Vuexmodule = Vuexmodule;
        this.name = name;
        this.state = state;
    }
    registerDynamicModule.prototype.register = function () {
        _1.storeBuilder.registerModule(this.name, __assign({ namespaced: true, state: this.state }, this.Vuexmodule));
        var _a = _1.stateBuilder(this.state, this.name), registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, registerActions = _a.registerActions, newState = _a.state;
        (this.mutations = registerMutations(this.Vuexmodule.mutations)),
            (this.actions = registerActions(this.Vuexmodule.actions)),
            (this.getters = registerGetters(this.Vuexmodule.getters)),
            Object.defineProperty(this, "state", {
                get: function () {
                    return newState;
                }
            });
    };
    registerDynamicModule.prototype.unregister = function () {
        _1.storeBuilder.unregisterModule(name);
    };
    return registerDynamicModule;
}());
function defineDynamicModule(name, state, vuexModule) {
    return new registerDynamicModule(name, state, vuexModule);
}
exports.defineDynamicModule = defineDynamicModule;
defineDynamicModule("vuex", { count: 1 }, {
    mutations: {}
});
