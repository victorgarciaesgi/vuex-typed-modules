declare type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true;
declare type inferMutations<T> = T extends (state: any, payload: infer P) => void ? IsValidArg<P> extends true ? (payload: P) => void : () => void : () => void;
declare type inferActions<T extends (context: any, payload?: any) => void> = T extends (context: any, payload: infer P) => any ? IsValidArg<P> extends true ? (payload: P) => ReturnType<T> : () => ReturnType<T> : ReturnType<T>;
declare type inferGetters<T extends (state: any) => any> = T extends (state: any) => infer R ? R : void;
declare type ReturnedGetters<T extends any> = {
    [K in keyof T]: inferGetters<T[K]>;
};
declare type ReturnedActions<T extends any> = {
    [K in keyof T]: inferActions<T[K]>;
};
declare type ReturnedMutations<T extends any> = {
    [K in keyof T]: inferMutations<T[K]>;
};
export declare const storeBuilder: import("vuex").Store<{}>;
export declare function stateBuilder<S>(state: S, name: string): {
    registerMutations: <T extends {
        [x: string]: (state: any, payload: any) => void;
    }>(mutations: T) => { [K in keyof T]: inferMutations<T[K]>; };
    registerActions: <T extends {
        [x: string]: (context: any, payload: any) => any;
    }>(actions: T) => { [K in keyof T]: inferActions<T[K]>; };
    registerGetters: <T extends {
        [x: string]: (state: any) => void;
    }>(getters: T) => { [K in keyof T]: inferGetters<T[K]>; };
    state: any;
};
export declare function defineModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}, A extends {
    [x: string]: (context: any, payload?: any) => any;
}, G extends {
    [x: string]: (state: any) => any;
}>(name: string, state: S, { actions, mutations, getters }: {
    actions: A;
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
};
export declare function defineModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}, A extends {
    [x: string]: (context: any, payload?: any) => any;
}>(name: string, state: S, { actions, mutations }: {
    actions: A;
    mutations: M;
}): {
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
};
export declare function defineModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}, G extends {
    [x: string]: (state: any) => any;
}>(name: string, state: S, { mutations, getters }: {
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    mutations: ReturnedMutations<M>;
    state: S;
};
export declare function defineModule<S, A extends {
    [x: string]: (context: any, payload?: any) => any;
}, G extends {
    [x: string]: (state: any) => any;
}>(name: string, state: S, { actions, getters }: {
    actions: A;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    state: S;
};
export declare function defineModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}>(name: string, state: S, { mutations }: {
    mutations: M;
}): {
    mutations: ReturnedMutations<M>;
    state: S;
};
export declare function defineModule<S, A extends {
    [x: string]: (context: any, payload?: any) => any;
}>(name: string, state: S, { actions }: {
    actions: A;
}): {
    actions: {
        [K in keyof A]: inferActions<A[K]>;
    };
    state: S;
};
export {};
