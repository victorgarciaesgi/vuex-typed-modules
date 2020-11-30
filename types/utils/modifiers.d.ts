import * as Vuex from 'vuex';
export declare function createModuleLayers(store: Vuex.Store<any>, moduleName: string): {
    commit: (name: any) => (payload: any) => void;
    dispatch: (name: any) => (payload: any) => Promise<any>;
    read: (name: any) => () => any;
    readonly state: () => any;
};
export declare function buildModifiers(store: Vuex.Store<any>, name: string): {
    registerMutations: (mutations: any) => any;
    registerActions: (actions: any) => any;
    registerGetters: (getters: any) => any;
    reactiveState: () => any;
};
