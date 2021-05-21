import * as Vuex from 'vuex';

export function createModuleLayers(store: Vuex.Store<any>, moduleName: string) {
  function commit(name: string) {
    return (payload: any) => store.commit(moduleName + '/' + name, payload);
  }

  function dispatch(name: string) {
    return (payload: any) => store.dispatch(moduleName + '/' + name, payload);
  }

  function read(name: string) {
    return () => {
      if (store) {
        return store.getters[moduleName + '/' + name];
      }
      return () => {};
    };
  }

  return {
    commit,
    dispatch,
    read,
    get state() {
      return () => store.state[moduleName];
    },
  };
}

export function buildModifiers(store: Vuex.Store<any>, name: string) {
  const { commit, dispatch, read, state } = createModuleLayers(store, name);

  const registerMutations = (mutations?: Record<string, any>) => {
    const renderedMutations = {} as Record<string, any>;
    if (mutations) {
      Object.keys(mutations).forEach((key) => {
        renderedMutations[key] = commit(key);
      });
    }
    return renderedMutations as any;
  };

  const registerActions = (actions?: Record<string, any>) => {
    const renderedActions = {} as Record<string, any>;
    if (actions) {
      Object.keys(actions).forEach((key) => {
        renderedActions[key] = dispatch(key);
      });
    }
    return renderedActions as any;
  };

  const registerGetters = (getters?: Record<string, any>) => {
    const renderedGetters = {};
    if (getters) {
      Object.keys(getters).forEach((key: any) => {
        Object.defineProperty(renderedGetters, key, {
          enumerable: true,
          configurable: true,
          get() {
            return read(key)();
          },
        });
      });
    }
    return renderedGetters as any;
  };

  return {
    registerMutations,
    registerActions,
    registerGetters,
    reactiveState: state,
  };
}
