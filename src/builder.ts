import Vuex from "vuex";
import Vue from "vue";
import {
  ReturnedMutations,
  ReturnedActions,
  ReturnedGetters,
  MutationsPayload,
  ActionsPayload,
  GettersPayload
} from "./types";
import { enableHotReload } from "./hotModule";
Vue.use(Vuex);

const storeBuilder = new Vuex.Store({});
const storedModules: any = {};

function functionNameError() {
  throw new Error(`Function name not supported.
  Causes: 
    -Production build with Uglyfication (see Readme)
    -Arrow functions
    -Old browser that don't supports function name`);
}

function createModuleTriggers(name, initialState) {
  function commit(handler) {
    if (!handler.name) {
      functionNameError();
    } else {
      return payload => storeBuilder.commit(name + "/" + handler.name, payload);
    }
  }

  function dispatch(handler) {
    if (!handler.name) {
      functionNameError();
    } else {
      return payload =>
        storeBuilder.dispatch(name + "/" + handler.name, payload);
    }
  }

  function read(handler) {
    if (!handler.name) {
      functionNameError();
    } else {
      return () => storeBuilder.getters[name + "/" + handler.name];
    }
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

  const registerMutations = <T extends MutationsPayload>(
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

  const registerActions = <T extends ActionsPayload>(
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

  const registerGetters = <T extends GettersPayload>(
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
  M extends MutationsPayload,
  A extends ActionsPayload,
  G extends GettersPayload
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
function defineModule<S, M extends MutationsPayload, A extends ActionsPayload>(
  name: string,
  state: S,
  { actions, mutations }: { actions: A; mutations: M }
): {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
};
function defineModule<S, M extends MutationsPayload, G extends GettersPayload>(
  name: string,
  state: S,
  { mutations, getters }: { mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  state: S;
};
function defineModule<S, A extends ActionsPayload, G extends GettersPayload>(
  name: string,
  state: S,
  { actions, getters }: { actions: A; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  state: S;
};
function defineModule<S, M extends MutationsPayload>(
  name: string,
  state: S,
  { mutations }: { mutations: M }
): { mutations: ReturnedMutations<M>; state: S };
function defineModule<S, A extends ActionsPayload>(
  name: string,
  state: S,
  { actions }: { actions: A }
): { actions: ReturnedActions<A>; state: S };
function defineModule(name, state, vuexModule) {
  if (module.hot) {
    enableHotReload(name, state, vuexModule);
  } else {
    storeBuilder.registerModule(name, {
      namespaced: true,
      state,
      ...vuexModule
    });
  }

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

export { storeBuilder, stateBuilder, defineModule, storedModules };
