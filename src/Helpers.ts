import Vue from 'vue';
import * as Vuex from 'vuex';
import { MutationsTree } from './types';

export const setHelpers = (mutations: MutationsTree<any>, state: any) => {
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
  mutations.updateListItem = (moduleState, { key, id, data }) => {
    const list = moduleState[key];
    const index = list.findIndex(f => f.id === id);
    const item = list.find(f => f.id === id);
    Vue.set(list, index, { ...item, ...data });
  };
  mutations.removeListItem = (moduleState, { key, id }) => {
    Vue.set(moduleState, key, moduleState[key].filter(f => f.id !== id));
  };
  mutations.addListItem = (moduleState, { key, data }) => {
    Vue.set(moduleState, key, moduleState[key].push(data));
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
      store.commit(`${name}/updateListItem`, { key, data });
    },
    updateListItem(key, id, data) {
      store.commit(`${name}/updateListItem`, { key, id, data });
    },
    removeListItem(key, id) {
      store.commit(`${name}/removeListItem`, { key, id });
    },
    concatList(key, data) {
      store.commit(`${name}/concatList`, { key, data });
    },
  };
};
