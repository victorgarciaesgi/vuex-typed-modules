"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createModuleLayers(store, moduleName) {
    function commit(name) {
        return function (payload) { return store.commit(moduleName + '/' + name, payload); };
    }
    function dispatch(name) {
        return function (payload) { return store.dispatch(moduleName + '/' + name, payload); };
    }
    function read(name) {
        return function () {
            if (store) {
                return store.getters[moduleName + '/' + name]();
            }
            return null;
        };
    }
    return {
        commit: commit,
        dispatch: dispatch,
        read: read,
        get state() {
            return function () { return store.state[moduleName]; };
        },
    };
}
exports.createModuleLayers = createModuleLayers;
function buildModifiers(store, name) {
    var _a = createModuleLayers(store, name), commit = _a.commit, dispatch = _a.dispatch, read = _a.read, state = _a.state;
    var registerMutations = function (mutations) {
        var renderedMutations = {};
        if (mutations) {
            Object.keys(mutations).forEach(function (key) {
                renderedMutations[key] = commit(key);
            });
        }
        return renderedMutations;
    };
    var registerActions = function (actions) {
        var renderedActions = {};
        if (actions) {
            Object.keys(actions).forEach(function (key) {
                renderedActions[key] = dispatch(key);
            });
        }
        return renderedActions;
    };
    var registerGetters = function (getters) {
        var renderedGetters = {};
        if (getters) {
            Object.keys(getters).forEach(function (key) {
                Object.defineProperty(renderedGetters, key, {
                    get: function () {
                        return read(key)();
                    },
                });
            });
        }
        return renderedGetters;
    };
    return {
        registerMutations: registerMutations,
        registerActions: registerActions,
        registerGetters: registerGetters,
        reactiveState: state,
    };
}
exports.buildModifiers = buildModifiers;
