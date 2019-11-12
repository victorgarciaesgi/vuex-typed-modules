import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations } from './types';
export interface VuexModuleArgs<S, G, M, A> {
    name: string;
    dynamic?: boolean;
    state: S;
    getters?: G;
    mutations?: M;
    actions?: A;
}
export declare class VuexModule<S = any, M extends Vuex.MutationTree<S> = any, G extends Vuex.GetterTree<S, any> = any, A extends Vuex.ActionTree<S, any> = any> {
    private name;
    private _initialState;
    private _getters;
    private _mutations;
    private _actions;
    private _dynamic;
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
    helpers: SharedMutations<S>;
    constructor({ name, state, actions, getters, mutations }: VuexModuleArgs<S, G, M, A>);
    extract(): {
        name: string;
        state: S;
        getters: Vuex.GetterTree<S, any>;
        actions: A;
        mutations: Vuex.MutationTree<S>;
    };
    protected activate(store: Vuex.Store<any>, namespace?: string): void;
    register(store: Vuex.Store<any>): void;
}
