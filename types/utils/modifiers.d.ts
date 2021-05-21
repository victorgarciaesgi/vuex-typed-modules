import * as Vuex from 'vuex';
export declare function createModuleLayers(store: Vuex.Store<any>, moduleName: string): {
    commit: (name: string) => (payload: any) => void;
    dispatch: (name: string) => (payload: any) => Promise<any>;
    read: (name: string) => () => any;
    readonly state: () => any;
};
export declare function buildModifiers(store: Vuex.Store<any>, name: string): {
    registerMutations: (mutations?: Record<string, any> | undefined) => any;
    registerActions: (actions?: Record<string, any> | undefined) => any;
    registerGetters: (getters?: Record<string, any> | undefined) => any;
    reactiveState: () => any;
};
