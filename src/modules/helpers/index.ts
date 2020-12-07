import Vue from 'vue';
import * as Vuex from 'vuex';

export const setHelpers = (mutations?: Vuex.MutationTree<any>) => {
  let _mutations = mutations ?? {};
  _mutations.resetState = (moduleState, initialState) => {
    Object.keys(moduleState).map((key) => {
      Vue.set(moduleState, key, initialState[key]);
    });
  };
  _mutations.updateState = (moduleState, params) => {
    Object.keys(params).map((key) => {
      Vue.set(moduleState, key, params[key]);
    });
  };
  return _mutations;
};
