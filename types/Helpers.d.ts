import * as Vuex from 'vuex';
import { MutationsTree } from './types';
export declare const setHelpers: (mutations: MutationsTree<any>, state: any) => void;
export declare const buildHelpers: (store: Vuex.Store<any>, name: string) => {
    resetState(): void;
    updateState(params: any): void;
    addListItem(key: any, data: any): void;
    updateListItem(key: any, id: any, data: any): void;
    removeListItem(key: any, id: any): void;
    concatList(key: any, data: any): void;
};
