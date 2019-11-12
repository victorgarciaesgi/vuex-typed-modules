import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './Module';
export declare class VuexDynamicModule<S = any, M extends Vuex.MutationTree<S> = any, G extends Vuex.GetterTree<S, any> = any, A extends Vuex.ActionTree<S, any> = any> extends VuexModule<S, M, G, A> {
    private namespace;
    private store;
    constructor({ namespace, ...rest }: VuexModuleArgs<S, G, M, A> & {
        namespace: string;
    });
    save(store: Vuex.Store<any>): void;
    register(): void;
}
