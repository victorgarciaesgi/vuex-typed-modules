import { VuexModuleArgs } from './default';
import { MutationTree, Store, GetterTree } from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, ActionBush, SharedMutations } from '../types';
export declare const useStore: (name: string) => Store<any>;
export declare type VuexModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>> = {
    state: S;
    getters: ReturnedGetters<G>;
    mutations: ReturnedMutations<M>;
    actions: ReturnedActions<A>;
} & SharedMutations<S>;
export declare function createDefaultModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>>({ name, state, actions, getters, mutations, }: VuexModuleArgs<S, G, M, A>): VuexModuleHook<S, M, G, A>;
export declare function createModuleHook<S extends Record<string, any>, M extends MutationTree<S>, G extends GetterTree<S, any>, A extends ActionBush<S>>(params: VuexModuleArgs<S, G, M, A>): () => VuexModuleHook<S, M, G, A>;
