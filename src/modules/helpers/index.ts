import Vue from 'vue';
import { isVue2, isVue3 } from 'vue-demi';
import * as Vuex from 'vuex';

export const setHelpers = (mutations?: Vuex.MutationTree<any>) => {
  let _mutations = mutations ?? {};
  _mutations.resetState = (moduleState, initialState) => {
    Object.keys(moduleState).map((key) => {
      if (isVue2) {
        Vue.set(moduleState, key, initialState[key]);
      } else if (isVue3) {
        moduleState[key] = initialState[key];
      }
    });
  };
  _mutations.updateState = (moduleState, params) => {
    Object.keys(params).map((key) => {
      if (isVue2) {
        Vue.set(moduleState, key, params[key]);
      } else if (isVue3) {
        moduleState[key] = params[key];
      }
    });
  };
  return _mutations;
};
