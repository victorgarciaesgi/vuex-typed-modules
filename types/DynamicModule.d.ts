import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './Module';
export declare class VuexDynamicModule<S, G, M, A> extends VuexModule {
    private namespace;
    constructor({ namespace, ...rest }: VuexModuleArgs<S, G, M, A> & {
        namespace: string;
    });
    register(store: Vuex.Store<any>): void;
}
