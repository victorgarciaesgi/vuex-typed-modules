import { SharedMutations } from '@/types';
import Vue from 'vue';
import * as Vuex from 'vuex';

export const setHelpers = (state: any, mutations?: Vuex.MutationTree<any>) => {
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

export const buildHelpers = (store: Vuex.Store<any>, name: string): SharedMutations<any> => {
  return {
    resetState() {
      store.commit(`${name}/resetState`);
    },
    updateState(params) {
      const storeState = store.state[name];
      const updatedState = params.call(storeState);
      const mergedState = {
        ...storeState,
        ...updatedState,
      };
      store.commit(`${name}/updateState`, mergedState);
    },
  };
};
