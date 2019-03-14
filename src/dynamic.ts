import { ReturnedGetters, ReturnedActions, ReturnedMutations } from "./types";
import { storeBuilder, stateBuilder } from "./";

class registerDynamicModule {
  public mutations;
  public actions;
  public getters;

  public Vuexmodule;
  public state;
  public name;

  constructor(name, state, Vuexmodule) {
    this.Vuexmodule = Vuexmodule;
    this.name = name;
    this.state = state;
  }
  public register() {
    storeBuilder.registerModule(name, {
      namespaced: true,
      state: this.state,
      ...this.Vuexmodule
    });
    const {
      registerGetters,
      registerMutations,
      registerActions,
      state: newState
    } = stateBuilder(this.state, name);
    (this.mutations = registerMutations(this.Vuexmodule.mutations)),
      (this.actions = registerActions(this.Vuexmodule.actions)),
      (this.getters = registerGetters(this.Vuexmodule.getters)),
      Object.defineProperty(this, "state", {
        get() {
          return newState;
        }
      });
  }
  public unregister() {
    storeBuilder.unregisterModule(name);
  }
}

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
  return new registerDynamicModule(name, state, vuexModule) as any;
}

export { defineDynamicModule };

defineDynamicModule(
  "vuex",
  { count: 1 },
  {
    mutations: {}
  }
);
