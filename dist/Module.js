"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modifiers_1 = require("./modifiers");
var Helpers_1 = require("./Helpers");
var VuexModule = (function () {
    function VuexModule(_a) {
        var name = _a.name, state = _a.state, actions = _a.actions, getters = _a.getters, mutations = _a.mutations;
        this.name = name;
        this._initialState = state;
        this._getters = getters;
        this._actions = actions;
        this._mutations = mutations;
    }
    VuexModule.prototype.extract = function () {
        return {
            name: this.name,
            state: this._initialState,
            getters: this._getters,
            actions: this._actions,
            mutations: this._mutations
        };
    };
    VuexModule.prototype.register = function (store) {
        var _a = modifiers_1.buildModifiers(store, this.name), registerActions = _a.registerActions, registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, reactiveState = _a.reactiveState;
        this.helpers = Helpers_1.buildHelpers(store, this.name);
        this.mutations = registerMutations(this._mutations);
        this.actions = registerActions(this._actions);
        this.getters = registerGetters(this._getters);
        Object.defineProperty(this, "state", {
            get: function () {
                return reactiveState();
            }
        });
    };
    return VuexModule;
}());
exports.VuexModule = VuexModule;
