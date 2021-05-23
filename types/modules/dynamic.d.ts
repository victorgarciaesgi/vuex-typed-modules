import { ActionBush } from 'src/types';
import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './default';
import { VuexModuleHook } from './hooks';
export declare type ModuleToInstance<TModule> = TModule extends VuexDynamicModule<infer S, infer M, infer G, infer A> ? DynamicModuleInstance<S, M, G, A> : TModule;
export declare class VuexDynamicModule<S extends Record<string, any>, M extends Vuex.MutationTree<S>, G extends Vuex.GetterTree<S, any>, A extends ActionBush<S>> {
    private nestedName?;
    private namespaceName;
    private module;
    private state;
    private getters;
    private mutations;
    private actions;
    private options?;
    private store;
    protected _logger: boolean;
    private get params();
    get name(): string;
    constructor({ name, mutations, state, actions, getters, options, logger, }: VuexModuleArgs<S, G, M, A>);
    save(store: Vuex.Store<any>): void;
    instance<NewState extends S = S>(moduleKey?: string): [DynamicModuleInstance<NewState, M, G, A>, () => VuexModuleHook<S, M, G, A>];
}
export declare class DynamicModuleInstance<S extends Record<string, any>, M extends Vuex.MutationTree<S>, G extends Vuex.GetterTree<S, any>, A extends Record<string, Vuex.ActionHandler<S, any>>> extends VuexModule<S, M, G, A> {
    private nestedName?;
    isRegistered: boolean;
    constructor({ store, ...args }: VuexModuleArgs<S, G, M, A> & {
        store: Vuex.Store<S>;
    });
    register(): void;
    unregister(): void;
}
export declare const createVuexDynamicModule: <S extends Record<string, any>, G extends Vuex.GetterTree<S, any>, M extends Vuex.MutationTree<S>, A extends Record<string, Vuex.ActionHandler<S, any>>>(params: VuexModuleArgs<S, G, M, A>) => VuexDynamicModule<S, M, G, A>;
