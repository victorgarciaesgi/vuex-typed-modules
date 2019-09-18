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
var vue_1 = __importDefault(require("vue"));
exports.setHelpers = function (mutations, state) {
    mutations.resetState = function (moduleState) {
        Object.keys(state).map(function (key) {
            vue_1.default.set(moduleState, key, state[key]);
        });
    };
    mutations.updateState = function (moduleState, params) {
        Object.keys(params).map(function (key) {
            vue_1.default.set(moduleState, key, params[key]);
        });
    };
    mutations.updateListItem = function (moduleState, _a) {
        var key = _a.key, id = _a.id, data = _a.data;
        var list = moduleState[key];
        var index = list.findIndex(function (f) { return f.id === id; });
        var item = list.find(function (f) { return f.id === id; });
        vue_1.default.set(list, index, __assign(__assign({}, item), data));
    };
    mutations.removeListItem = function (moduleState, _a) {
        var key = _a.key, id = _a.id;
        vue_1.default.set(moduleState, key, moduleState[key].filter(function (f) { return f.id !== id; }));
    };
    mutations.addListItem = function (moduleState, _a) {
        var key = _a.key, data = _a.data;
        vue_1.default.set(moduleState, key, moduleState[key].push(data));
    };
    mutations.concatList = function (moduleState, _a) {
        var key = _a.key, data = _a.data;
        vue_1.default.set(moduleState, key, moduleState[key].concat(data));
    };
};
exports.buildHelpers = function (store, name) {
    return {
        resetState: function () {
            store.commit(name + "/resetState");
        },
        updateState: function (params) {
            store.commit(name + "/updateState", params);
        },
        addListItem: function (key, data) {
            store.commit(name + "/updateListItem", { key: key, data: data });
        },
        updateListItem: function (key, id, data) {
            store.commit(name + "/updateListItem", { key: key, id: id, data: data });
        },
        removeListItem: function (key, id) {
            store.commit(name + "/removeListItem", { key: key, id: id });
        },
        concatList: function (key, data) {
            store.commit(name + "/concatList", { key: key, data: data });
        },
    };
};
