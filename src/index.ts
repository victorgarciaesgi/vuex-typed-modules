import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

type IsValidArg<T> = T extends object
  ? (keyof T extends never ? false : true)
  : true;

type inferMutations<T> = T extends (state: any, payload: infer P) => void
  ? IsValidArg<P> extends true
    ? (payload: P) => void
    : () => void
  : () => void;

type inferActions<T extends (context: any, payload?: any) => void> = T extends (
  context,
  payload: infer P
) => any
  ? IsValidArg<P> extends true
    ? (payload: P) => ReturnType<T>
    : () => ReturnType<T>
  : ReturnType<T>;

type inferGetters<T extends (state) => any> = T extends (state) => infer R
  ? R
  : void;

type ReturnedGetters<T extends any> = { [K in keyof T]: inferGetters<T[K]> };
type ReturnedActions<T extends any> = { [K in keyof T]: inferActions<T[K]> };
type ReturnedMutations<T extends any> = {
  [K in keyof T]: inferMutations<T[K]>
};

export const storeBuilder = new Vuex.Store({});

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

export function stateBuilder<S>(state: S, name: string) {
  const b = createModuleTriggers(name, state);

  const registerMutations = <
    T extends { [x: string]: (state, payload) => void }
  >(
    mutations: T
  ): { [K in keyof T]: inferMutations<T[K]> } => {
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
  ): { [K in keyof T]: inferActions<T[K]> } => {
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
  ): { [K in keyof T]: inferGetters<T[K]> } => {
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

export function defineModule<
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
export function defineModule<
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
export function defineModule<
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
export function defineModule<
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
export function defineModule<
  S,
  M extends { [x: string]: (state, payload?) => void }
>(
  name: string,
  state: S,
  { mutations }: { mutations: M }
): { mutations: ReturnedMutations<M>; state: S };
export function defineModule<
  S,
  A extends { [x: string]: (context, payload?) => any }
>(
  name: string,
  state: S,
  { actions }: { actions: A }
): { actions: { [K in keyof A]: inferActions<A[K]> }; state: S };
export function defineModule(name, state, vuexModule) {
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
