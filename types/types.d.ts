import { Getter, GetterTree, ActionHandler, MutationTree, Store, Dispatch } from 'vuex';
export declare type IsValidArg<T> = T extends unknown ? (keyof T extends never ? false : true) : true;
export declare type Dictionary<T> = {
    [x: string]: T;
};
export declare type KeepProperties<T, P> = Pick<T, {
    [K in keyof T]: T[K] extends P ? K : never;
}[keyof T]>;
export declare type isEmpty<T extends Record<string, any>> = keyof T extends never ? true : false;
export declare type ParameterName<T extends (...args: [any, any]) => any> = T extends (context: any, ...args: infer P) => any ? P : never;
export declare type inferMutations<T> = T extends (state: any, payload: infer P) => void ? IsValidArg<P> extends true ? (...args: ParameterName<T>) => void : () => void : () => void;
export declare type inferActions<T extends ActionHandler<any, any>> = T extends (context: any, payload: infer P) => any ? IsValidArg<P> extends true ? (...args: ParameterName<T>) => ReturnType<T> : () => ReturnType<T> : ReturnType<T>;
export declare type inferGetters<T extends Getter<any, any>> = T extends (state: any, getters?: any) => infer R ? R : void;
export interface RichActionContext<S, G extends ReturnedGetters<any>, M extends ReturnedMutations<any>> {
    dispatch: Dispatch;
    mutations: M;
    state: S;
    getters: G;
}
export declare type RichAction<S, G extends ReturnedGetters<any>, M extends ReturnedMutations<any>> = (this: Store<any>, injectee: RichActionContext<S, G, M>, payload?: any) => any;
export interface RichActionTree<S, G extends ReturnedGetters<any>, M extends ReturnedMutations<any>> {
    [x: string]: RichAction<S, G, M>;
}
export declare type ActionBush<S> = Record<string, ActionHandler<S, any>>;
export declare type ReturnedGetters<T extends GetterTree<any, any>> = isEmpty<T> extends true ? never : {
    [K in keyof T]: inferGetters<T[K]>;
};
export declare type ReturnedActions<T extends ActionBush<any>> = isEmpty<T> extends true ? never : {
    [K in keyof T]: inferActions<T[K]>;
};
export declare type ReturnedMutations<T extends MutationTree<any>> = isEmpty<T> extends true ? never : {
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
    updateState(callback: (state: S) => Partial<S>): void;
};
