import { ReturnedGetters, ReturnedActions, ReturnedMutations } from "./types";
import { storeBuilder, stateBuilder } from "./builder";
import { storedModules } from "./builder";
import { enableHotReload, disableHotReload } from "./hotModule";

class registerDynamicModule {
  public mutations = {};
  public actions = {};
  public getters = {};

  public Vuexmodule;
  public initialState;
  public name;
  public state;
  public newState = {};

  private registered = false;

  constructor(name, state, Vuexmodule) {
    this.Vuexmodule = Vuexmodule;
    this.name = name;
    this.initialState = state;
    Object.defineProperty(this, "state", {
      get() {
        return this.newState;
      },
      set(value) {
        this.newState = value;
      }
    });
  }
  public register() {
    storedModules[this.name] = {
      namespaced: true,
      state: this.initialState,
      ...this.Vuexmodule
    };
    if (!storeBuilder.state[this.name] && !this.registered) {
      storeBuilder.registerModule(this.name, {
        namespaced: true,
        state: this.initialState,
        ...this.Vuexmodule
      });
      this.registered = true;
    }
    if (storeBuilder.state[this.name]) {
      const {
        registerGetters,
        registerMutations,
        registerActions,
        state: newState
      } = stateBuilder(this.initialState, this.name);
      (this.mutations = registerMutations(this.Vuexmodule.mutations)),
        (this.actions = registerActions(this.Vuexmodule.actions)),
        (this.getters = registerGetters(this.Vuexmodule.getters)),
        (this.newState = newState);
    }
  }
  public unregister() {
    if (!module.hot) {
      storeBuilder.unregisterModule(this.name);
      disableHotReload(this.name);
      this.mutations = {};
      this.actions = {};
      this.getters = {};
      this.state = {};
      this.registered = false;
    }
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
  resetState(): void;
  updateState(params: Partial<S>): void;
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
  resetState(): void;
  updateState(params: Partial<S>): void;
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
  resetState(): void;
  updateState(params: Partial<S>): void;
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
  resetState(): void;
  updateState(params: Partial<S>): void;
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
  resetState(): void;
  updateState(params: Partial<S>): void;
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
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineDynamicModule(name, state, vuexModule) {
  enableHotReload(name, state, vuexModule, true);
  return new registerDynamicModule(name, state, vuexModule) as any;
}

export { defineDynamicModule };
