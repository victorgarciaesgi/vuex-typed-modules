import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, ActionBush } from '../types';
import { VuexModuleHook } from './hooks';
export interface VuexModuleArgs<S extends Record<string, any>, G extends Vuex.GetterTree<S, any> = never, M extends Vuex.MutationTree<S> = never, A extends ActionBush<S> = never> {
    name: string;
    state: S;
    getters?: G;
    mutations?: M;
    actions?: A;
    options?: Vuex.ModuleOptions;
    logger?: boolean;
}
export declare class VuexModule<S extends Record<string, any>, M extends Vuex.MutationTree<S>, G extends Vuex.GetterTree<S, any>, A extends ActionBush<S>> {
    protected name: string;
    protected initialState: S;
    protected _getters?: Vuex.GetterTree<S, any>;
    protected _mutations?: Vuex.MutationTree<S>;
    protected _actions?: A;
    protected _options?: Vuex.ModuleOptions;
    protected _logger: boolean;
    protected _state: S;
    protected store: Vuex.Store<S>;
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
    constructor({ name, state, actions, getters, mutations, options, logger, }: VuexModuleArgs<S, G, M, A>);
    resetState(): void;
    updateState(callback: ((state: S) => Partial<S> | void) | Partial<S>): void;
    extract(): {
        name: string;
        state: S;
        getters: Vuex.GetterTree<S, any> | undefined;
        actions: any;
        mutations: Vuex.MutationTree<S> | undefined;
        options: Vuex.ModuleOptions | undefined;
    };
    protected activate(store: Vuex.Store<any>): void;
    deploy(store: Vuex.Store<any>): void;
}
export declare const createVuexModule: <S extends Record<string, any>, G extends Vuex.GetterTree<S, any>, M extends Vuex.MutationTree<S>, A extends ActionBush<S>>(params: VuexModuleArgs<S, G, M, A>) => [VuexModule<S, M, G, A>, () => VuexModuleHook<S, M, G, A>];
