import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations } from '../types';
import { buildModifiers } from '../modifiers';
import { buildHelpers, setHelpers } from './helpers';

export interface DefaultVuexModuleArgs<S extends Record<string, any>> {
  name: string;
  state: S;
  options?: Vuex.ModuleOptions;
  logger?: boolean;
}
export type SharedReturn<S> = SharedMutations<S> & {
  state: S;
};

// Overloads

export function defineVuexModule<S extends Record<string, any>, M extends Vuex.MutationTree<S>>(
  args: DefaultVuexModuleArgs<S> & { mutations: M }
): SharedReturn<S> & {
  mutations: ReturnedMutations<M>;
};
export function defineVuexModule<S extends Record<string, any>, G extends Vuex.GetterTree<S, any>>(
  args: DefaultVuexModuleArgs<S> & { getters: G }
): SharedReturn<S> & {
  getters: ReturnedGetters<G>;
};
export function defineVuexModule<
  S extends Record<string, any>,
  A extends Record<string, Vuex.ActionHandler<S, any>>
>(
  args: DefaultVuexModuleArgs<S> & { actions: A }
): SharedReturn<S> & {
  actions: ReturnedActions<A>;
};
export function defineVuexModule<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  A extends Record<string, Vuex.ActionHandler<S, any>>
>(
  args: DefaultVuexModuleArgs<S> & { mutations: M; actions: A }
): SharedReturn<S> & {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
};
export function defineVuexModule<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  G extends Vuex.GetterTree<S, any>
>(
  args: DefaultVuexModuleArgs<S> & { getters: G; mutations: M }
): SharedReturn<S> & {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
};
export function defineVuexModule<
  S extends Record<string, any>,
  G extends Vuex.GetterTree<S, any>,
  A extends Record<string, Vuex.ActionHandler<S, any>>
>(
  args: DefaultVuexModuleArgs<S> & { getters: G; actions: A }
): SharedReturn<S> & {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
};
export function defineVuexModule<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  G extends Vuex.GetterTree<S, any>,
  A extends Record<string, Vuex.ActionHandler<S, any>>
>({
  logger = true,
  ...args
}: DefaultVuexModuleArgs<S> & { getters: G; mutations: M; actions: A }): SharedReturn<S> & {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
} {
  let helpers = {};
  let mutations = {};
  let actions = {};
  let getters = {};
  let _reactiveState = () => {};

  function activate(store: Vuex.Store<any>): void {
    if (store.hasModule(args.name)) {
      console.info(`Module ${args.name} still active, skipping activation`);
      return;
    } else {
      const moduleName = args.name;
      const _mutations = setHelpers(args.mutations, args.state);
      store.registerModule(
        moduleName,
        {
          namespaced: true,
          actions: args.actions,
          getters: args.getters,
          mutations: _mutations,
          state: args.state,
        },
        args.options
      );
      const { registerActions, registerGetters, registerMutations, reactiveState } = buildModifiers(
        store,
        moduleName
      );
      helpers = buildHelpers(store, moduleName);
      mutations = registerMutations(_mutations);
      actions = registerActions(args.actions);
      getters = registerGetters(args.mutations);
      _reactiveState = reactiveState;
    }
  }

  function deploy(store: Vuex.Store<any>) {
    activate(store);
  }
  return {
    actions,
    mutations,
    getters,
    get state() {
      return _reactiveState();
    },
    ...helpers,
    deploy,
    activate,
  } as any;
}

// const test = defineVuexModule({
//   name: 'zefez',
//   state: {
//     foo: 'bar',
//   },
//   mutations: {
//     boo(state) {
//       state.foo;
//     },
//   },
//   actions: {
//     test(_, param: string) {},
//   },
// });
// // @ts-expect-error
// test.actions.test();
