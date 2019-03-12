import { ReturnedGetters, ReturnedActions, ReturnedMutations } from "./types";
import { storeBuilder, stateBuilder } from "./";

function defineDynamicModule<
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
  register(): void;
  unregister(): void;
};
function defineDynamicModule<
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
  register(): void;
  unregister(): void;
};
function defineDynamicModule<
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
  register(): void;
  unregister(): void;
};
function defineDynamicModule<
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
  register(): void;
  unregister(): void;
};
function defineDynamicModule<
  S,
  M extends { [x: string]: (state, payload?) => void }
>(
  name: string,
  state: S,
  { mutations }: { mutations: M }
): {
  mutations: ReturnedMutations<M>;
  state: S;
  register(): void;
  unregister(): void;
};
function defineDynamicModule<
  S,
  A extends { [x: string]: (context, payload?) => any }
>(
  name: string,
  state: S,
  { actions }: { actions: A }
): {
  actions: ReturnedActions<A>;
  state: S;
  register(): void;
  unregister(): void;
};
function defineDynamicModule(name, state, vuexModule) {
  function register() {
    storeBuilder.registerModule(name, {
      namespaced: true,
      state,
      ...vuexModule
    });
  }
  function unregister() {
    storeBuilder.unregisterModule(name);
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
    },
    register,
    unregister
  } as any;
}

export { defineDynamicModule };
