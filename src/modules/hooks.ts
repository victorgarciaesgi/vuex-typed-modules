import { VuexModuleArgs } from './default';
import { MutationTree, Store, GetterTree } from 'vuex';
import {
  ReturnedGetters,
  ReturnedActions,
  ReturnedMutations,
  ActionBush,
  SharedMutations,
} from '../types';
import { buildModifiers } from '../utils/modifiers';
import cloneDeep from 'lodash/cloneDeep';
import { getCurrentInstance, readonly, toRefs, ToRefs } from 'vue-demi';

export const useStore = (name: string): Store<any> => {
  const vm = getCurrentInstance();
  if (!vm) throw new Error(`${name} hook must be called within a setup function`);
  return vm.proxy.$store;
};

export interface VuexModuleHookOptions<TWrap extends boolean> {
  unwrap: TWrap;
}

export type VuexModuleHook<
  S extends Record<string, any>,
  M extends MutationTree<S>,
  G extends GetterTree<S, any>,
  A extends ActionBush<S>,
  TWrap extends boolean = false
> = {
  state: TWrap extends true ? S : ToRefs<S>;
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  actions: ReturnedActions<A>;
} & SharedMutations<S>;

export function createDefaultModuleHook<
  S extends Record<string, any>,
  M extends MutationTree<S>,
  G extends GetterTree<S, any>,
  A extends ActionBush<S>,
  TWrap extends boolean
>({
  name,
  state,
  actions,
  getters,
  mutations,
  hookOptions,
}: VuexModuleArgs<S, G, M, A> & { hookOptions?: VuexModuleHookOptions<TWrap> }): VuexModuleHook<
  S,
  M,
  G,
  A,
  TWrap
> {
  const store = useStore(name);

  const initialState = readonly(cloneDeep(state));

  function resetState(): void {
    store.commit(`${name}/resetState`, initialState);
  }
  function updateState(callback: ((state: S) => Partial<S> | void) | Partial<S>) {
    const storeState = store.state[name];
    let updatedState: Partial<S> | null = null;
    if (callback instanceof Function) {
      const returnedKeys = callback(storeState);
      if (returnedKeys) {
        updatedState = returnedKeys;
      }
    } else {
      updatedState = callback;
    }
    const stateToUpdate = updatedState ?? storeState;
    store.commit(`${name}/updateState`, stateToUpdate);
  }

  const { registerActions, registerGetters, registerMutations, reactiveState } = buildModifiers(
    store,
    name
  );

  const _mutations = registerMutations(mutations);
  const _actions = registerActions(actions);
  const _getters = registerGetters(getters);
  const _state = hookOptions?.unwrap ? readonly(reactiveState()) : toRefs(reactiveState());

  return {
    state: _state,
    actions: _actions,
    getters: _getters,
    mutations: _mutations,
    resetState,
    updateState,
  };
}

export function createModuleHook<
  S extends Record<string, any>,
  M extends MutationTree<S>,
  G extends GetterTree<S, any>,
  A extends ActionBush<S>
>(params: VuexModuleArgs<S, G, M, A>) {
  return <TWrap extends boolean>(hookOptions?: VuexModuleHookOptions<TWrap>) =>
    createDefaultModuleHook({ ...params, hookOptions });
}
