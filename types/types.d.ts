export declare type IsValidArg<T> = T extends unknown ? (keyof T extends never ? false : true) : true;
export declare type Dictionary<T> = {
    [x: string]: T;
};
export declare type KeepProperties<T, P> = Pick<T, {
    [K in keyof T]: T[K] extends P ? K : never;
}[keyof T]>;
export declare type inferMutations<T> = T extends (state: any, payload: infer P) => void ? IsValidArg<P> extends true ? (payload: P) => void : () => void : () => void;
export declare type inferActions<T extends (context: any, payload?: any) => void> = T extends (context: any, payload: infer P) => any ? IsValidArg<P> extends true ? (payload: P) => ReturnType<T> : () => ReturnType<T> : ReturnType<T>;
export declare type inferGetters<T extends (state: any, getters?: any) => any> = T extends (state: any, getters?: any) => infer R ? R : void;
export declare type MutationsTree<S> = {
    [x: string]: (state: S, payload: any) => void;
};
export declare type ActionsTree = {
    [x: string]: (context: any, payload?: any) => any;
};
export declare type GettersTree<S> = {
    [x: string]: (state?: S, getters?: any) => any;
};
export declare type ReturnedGetters<T extends any> = {
    [K in keyof T]: inferGetters<T[K]>;
};
export declare type ReturnedActions<T extends any> = {
    [K in keyof T]: inferActions<T[K]>;
};
export declare type ReturnedMutations<T extends any> = {
    [K in keyof T]: inferMutations<T[K]>;
};
export declare type StoreModuleType = {
    getters?: ReturnedGetters<any>;
    actions?: ReturnedActions<any>;
    mutations?: ReturnedMutations<any>;
    state: any;
} & SharedMutations<any>;
export declare type SharedMutations<S> = {
    resetState(): void;
    updateState(params: Partial<S>): void;
    updateListItem<T extends keyof KeepProperties<S, any[]>>(key: T, id: string, data: S[T] extends Array<any> ? {
        [K in keyof S[T][0]]+?: S[T][0][K];
    } : any): void;
    removeListItem<T extends keyof KeepProperties<S, any[]>>(key: T, id: string): void;
    addListItem<T extends keyof KeepProperties<S, any[]>>(key: T, data: S[T] extends Array<any> ? {
        [K in keyof S[T][0]]+?: S[T][0][K];
    } : any): void;
    concatList<T extends keyof KeepProperties<S, any[]>>(key: T, data: S[T] extends Array<any> ? S[T] : any): any;
};
