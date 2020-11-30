import { SharedMutations } from '../../types';
import Vue from 'vue';
import * as Vuex from 'vuex';

export const setHelpers = (state: Record<string, any>, mutations?: Vuex.MutationTree<any>) => {
  let _mutations = mutations ?? {};
  _mutations.resetState = (moduleState) => {
    Object.keys(state).map((key) => {
      Vue.set(moduleState, key, state[key]);
    });
  };
  _mutations.updateState = (moduleState, params) => {
    Object.keys(params).map((key) => {
      Vue.set(moduleState, key, params[key]);
    });
  };
  return _mutations;
};
