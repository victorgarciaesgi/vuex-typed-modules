import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations } from './types';
export interface VuexModuleArgs<S, G, M, A> {
    name: string;
    state: S;
    getters?: G;
    mutations?: M;
    actions?: A;
    options?: Vuex.ModuleOptions;
}
export declare class VuexModule<S extends Record<string, any> = any, M extends Vuex.MutationTree<S> = any, G extends Vuex.GetterTree<S, any> = any, A extends Record<string, Vuex.ActionHandler<any, any>> = any> {
    protected name: string;
    protected _initialState: S;
    protected _getters: Vuex.GetterTree<S, any>;
    protected _mutations: Vuex.MutationTree<S>;
    protected _actions: A;
    protected _options: Vuex.ModuleOptions;
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
    helpers: SharedMutations<S>;
    constructor({ name, state, actions, getters, mutations, options }: VuexModuleArgs<S, G, M, A>);
    extract(): {
        name: string;
        state: S;
        getters: Vuex.GetterTree<S, any>;
        actions: A;
        mutations: Vuex.MutationTree<S>;
        options: Vuex.ModuleOptions;
    };
    protected activate(store: Vuex.Store<any>, namespace?: string): void;
    register(store: Vuex.Store<any>): void;
}
