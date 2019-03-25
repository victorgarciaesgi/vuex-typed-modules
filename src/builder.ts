import { Store } from "vuex";
import {
  ReturnedMutations,
  ReturnedActions,
  ReturnedGetters,
  MutationsPayload,
  ActionsPayload,
  GettersPayload
} from "./types";
import { enableHotReload } from "./hotModule";
import { oc } from "ts-optchain";

class storeConstructor {
  private _store!: Store<any>;
  public storedModules: any = {};

  public Store(storeConstructor) {
    this._store = new storeConstructor({
      modules: this.storedModules
    });
    return this._store;
  }

  storeModule(name: string, state, vuexModule) {
    this.storedModules[name] = {
      namespaced: true,
      state,
      ...vuexModule
    };
  }

  deleteStoreModule(name: string) {
    delete this.storedModules[name];
  }

  get state() {
    return oc(this._store).state;
  }

  get getters() {
    return oc(this._store).getters;
  }

  commit(fnName: string, payload: any) {
    oc(this._store).commit(() => {})(fnName, payload);
  }

  dispatch(fnName: string, payload: any) {
    oc(this._store).dispatch()(fnName, payload);
  }

  registerModule(name: string, state, modules: any) {
    if (this._store) {
      this._store.registerModule(name, {
        namespaced: true,
        state,
        ...modules
      });
    }
  }
  unregisterModule(name: string) {
    oc(this._store).unregisterModule(() => {})(name);
  }
  hotUpdate() {
    if (this._store) {
      this._store.hotUpdate({
        modules: {
          ...this.storedModules
        }
      });
    }
  }
}

const storeBuilder = new storeConstructor();

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
      return () => storeBuilder.getters[name + "/" + handler.name]();
    }
  }

  function state() {
    return () => storeBuilder.state[name]();
  }

  return {
    commit,
    dispatch,
    read,
    state
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
  enableHotReload(name, state, vuexModule);
  storeBuilder.storeModule(name, state, vuexModule);

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
      return newState()();
    }
  } as any;
}

export { storeBuilder, stateBuilder, defineModule };
