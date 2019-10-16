import * as Vuex from 'vuex';
import { ActionsTree, GettersTree, ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations, MutationsTree } from './types';
export interface VuexModuleArgs<S, G, M, A> {
    name: string;
    dynamic?: boolean;
    state: S;
    getters?: G;
    mutations?: M;
    actions?: A;
}
export declare class VuexModule<S = any, M extends MutationsTree<S> = any, G extends GettersTree<S> = any, A extends ActionsTree = any> {
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
        getters: GettersTree<S>;
        actions: A;
        mutations: MutationsTree<S>;
    };
    protected activate(store: Vuex.Store<any>, namespace?: string): void;
    register(store: Vuex.Store<any>): void;
}
