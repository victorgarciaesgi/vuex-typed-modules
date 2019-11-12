import Vue from 'vue';
import * as Vuex from 'vuex';

export const setHelpers = (mutations: Vuex.MutationTree<any>, state: any) => {
  mutations.resetState = moduleState => {
    Object.keys(state).map(key => {
      Vue.set(moduleState, key, state[key]);
    });
  };
  mutations.updateState = (moduleState, params) => {
    Object.keys(params).map(key => {
      Vue.set(moduleState, key, params[key]);
    });
  };
  mutations.updateListItem = (moduleState, { key, identifier, data }) => {
    const list = moduleState[key];
    const index = list.findIndex(f =>
      Object.keys(identifier).every(prop => f[prop] === identifier[prop])
    );
    const item = list.find(f =>
      Object.keys(identifier).every(prop => f[prop] === identifier[prop])
    );
    Vue.set(list, index, { ...item, ...data });
  };
  mutations.removeListItem = (moduleState, { key, identifier }) => {
    Vue.set(
      moduleState,
      key,
      moduleState[key].filter(f => {
        return Object.keys(identifier).every(prop => f[prop] !== identifier[prop]);
      })
    );
  };
  mutations.addListItem = (moduleState, { key, data }) => {
    Vue.set(moduleState, key, [...moduleState[key], data]);
  };
  mutations.concatList = (moduleState, { key, data }) => {
    Vue.set(moduleState, key, moduleState[key].concat(data));
  };
};

export const buildHelpers = (store: Vuex.Store<any>, name: string) => {
  return {
    resetState() {
      store.commit(`${name}/resetState`);
    },
    updateState(params) {
      store.commit(`${name}/updateState`, params);
    },
    addListItem(key, data) {
      store.commit(`${name}/addListItem`, { key, data });
    },
    updateListItem(key, identifier, data) {
      store.commit(`${name}/updateListItem`, { key, identifier, data });
    },
    removeListItem(key, identifier) {
      store.commit(`${name}/removeListItem`, { key, identifier });
    },
    concatList(key, data) {
      store.commit(`${name}/concatList`, { key, data });
    },
  };
};
