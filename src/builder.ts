import Vuex from "vuex";
import Vue from "vue";
import { ReturnedMutations, ReturnedActions, ReturnedGetters } from "./types";
Vue.use(Vuex);

const storeBuilder = new Vuex.Store({});

function createModuleTriggers(name, initialState) {
  function commit(handler) {
    return payload => storeBuilder.commit(name + "/" + handler.name, payload);
  }

  function dispatch(handler) {
    return payload => storeBuilder.dispatch(name + "/" + handler.name, payload);
  }

  function read(handler) {
    return () => storeBuilder.getters[name + "/" + handler.name];
  }

  return {
    commit,
    dispatch,
    read,
    get state() {
      return storeBuilder.state[name];
    }
  };
}

function stateBuilder<S>(state: S, name: string) {
  const b = createModuleTriggers(name, state);

  const registerMutations = <
    T extends { [x: string]: (state, payload) => void }
  >(
    mutations: T
  ): ReturnedMutations<T> => {
    let renderedMutations = {};
    if (mutations) {
      Object.keys(mutations).map(m => {
        renderedMutations[m] = b.commit(mutations[m]);
      });
    }
    return renderedMutations as any;
  };

  const registerActions = <
    T extends { [x: string]: (context, payload) => any }
  >(
    actions: T
  ): ReturnedActions<T> => {
    let renderedActions = {};
    if (actions) {
      Object.keys(actions).map(m => {
        renderedActions[m] = b.dispatch(actions[m]);
      });
    }
    return renderedActions as any;
  };

  const registerGetters = <T extends { [x: string]: (state) => void }>(
    getters: T
  ): ReturnedGetters<T> => {
    let renderedGetters = {};
    if (getters) {
      Object.keys(getters).map((m: any) => {
        Object.defineProperty(renderedGetters, m, {
          get() {
            return b.read(getters[m])();
          }
        });
      });
      console.log(renderedGetters);
    }
    return renderedGetters as any;
  };
  return {
    registerMutations,
    registerActions,
    registerGetters,
    state: b.state
  };
}

function defineModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  A extends { [x: string]: (context, payload?) => any },
  G extends { [x: string]: (state) => any }
>(
  name: string,
  state: S,
  { actions, mutations, getters }: { actions: A; mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
};
function defineModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  A extends { [x: string]: (context, payload?) => any }
>(
  name: string,
  state: S,
  { actions, mutations }: { actions: A; mutations: M }
): {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
};
function defineModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  G extends { [x: string]: (state) => any }
>(
  name: string,
  state: S,
  { mutations, getters }: { mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  state: S;
};
function defineModule<
  S,
  A extends { [x: string]: (context, payload?) => any },
  G extends { [x: string]: (state) => any }
>(
  name: string,
  state: S,
  { actions, getters }: { actions: A; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  state: S;
};
function defineModule<S, M extends { [x: string]: (state, payload?) => void }>(
  name: string,
  state: S,
  { mutations }: { mutations: M }
): { mutations: ReturnedMutations<M>; state: S };
function defineModule<S, A extends { [x: string]: (context, payload?) => any }>(
  name: string,
  state: S,
  { actions }: { actions: A }
): { actions: ReturnedActions<A>; state: S };
function defineModule(name, state, vuexModule) {
  storeBuilder.registerModule(name, {
    namespaced: true,
    state,
    ...vuexModule
  });
  const {
    registerGetters,
    registerMutations,
    registerActions,
    state: newState
  } = stateBuilder(state, name);
  return {
    mutations: registerMutations(vuexModule.mutations),
    actions: registerActions(vuexModule.actions),
    getters: registerGetters(vuexModule.getters),
    get state() {
      return newState;
    }
  } as any;
}

export { storeBuilder, stateBuilder, defineModule };
