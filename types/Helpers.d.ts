import * as Vuex from 'vuex';
export declare const setHelpers: (mutations: Vuex.MutationTree<any>, state: any) => void;
export declare const buildHelpers: (store: Vuex.Store<any>, name: string) => {
    resetState(): void;
    updateState(params: any): void;
    addListItem(key: any, data: any): void;
    updateListItem(key: any, identifier: any, data: any): void;
    removeListItem(key: any, identifier: any): void;
    concatList(key: any, data: any): void;
};
