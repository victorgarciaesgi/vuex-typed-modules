import { VuexModuleArgs } from './default';
import { MutationTree, Store, GetterTree } from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, ActionBush, SharedMutations } from '../types';
import { ToRefs } from 'vue-demi';
export declare const useStore: (name: string) => Store<any>;
export interface VuexModuleHookOptions<TWrap extends boolean> {
    unwrap: TWrap;
}
export declare type VuexModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>, TWrap extends boolean = false> = {
    state: TWrap extends true ? S : ToRefs<S>;
    getters: ReturnedGetters<G>;
    mutations: ReturnedMutations<M>;
    actions: ReturnedActions<A>;
} & SharedMutations<S>;
export declare function createDefaultModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>, TWrap extends boolean>({ name, state, actions, getters, mutations, hookOptions, }: VuexModuleArgs<S, G, M, A> & {
    hookOptions?: VuexModuleHookOptions<TWrap>;
}): VuexModuleHook<S, M, G, A, TWrap>;
export declare function createModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>>(params: VuexModuleArgs<S, G, M, A>): <TWrap extends boolean>(hookOptions?: VuexModuleHookOptions<TWrap> | undefined) => VuexModuleHook<S, M, G, A, TWrap>;
