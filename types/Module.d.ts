import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations } from './types';
export interface VuexModuleArgs<S extends Record<string, any>, G extends Vuex.GetterTree<S, any> = never, M extends Vuex.MutationTree<S> = never, A extends Record<string, Vuex.ActionHandler<any, any>> = never> {
    name: string;
    state: S;
    getters?: G;
    mutations?: M;
    actions?: A;
    options?: Vuex.ModuleOptions;
    logger?: boolean;
}
export declare class VuexModule<S extends Record<string, any>, M extends Vuex.MutationTree<S>, G extends Vuex.GetterTree<S, any>, A extends Record<string, Vuex.ActionHandler<any, any>>> {
    protected name: string;
    protected _initialState: S;
    protected _getters: Vuex.GetterTree<S, any>;
    protected _mutations: Vuex.MutationTree<S>;
    protected _actions: A;
    protected _options: Vuex.ModuleOptions;
    protected _logger: boolean;
    getters: G extends never ? undefined : ReturnedGetters<G>;
    actions: A extends never ? undefined : ReturnedActions<A>;
    mutations: M extends never ? undefined : ReturnedMutations<M>;
    state: S;
    helpers: SharedMutations<S>;
    constructor({ name, state, actions, getters, mutations, options, logger, }: VuexModuleArgs<S, G, M, A>);
    extract(): {
        name: string;
        state: S;
        getters: Vuex.GetterTree<S, any>;
        actions: A;
        mutations: Vuex.MutationTree<S>;
        options: Vuex.ModuleOptions;
    };
    protected activate(store: Vuex.Store<any>, nestedName?: string): void;
    deploy(store: Vuex.Store<any>): void;
}
