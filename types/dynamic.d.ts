import { ReturnedGetters, ReturnedActions, ReturnedMutations } from "./types";
declare function defineDynamicModule<S, M extends {
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
    register(): void;
    unregister(): void;
};
declare function defineDynamicModule<S, M extends {
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
    register(): void;
    unregister(): void;
};
declare function defineDynamicModule<S, M extends {
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
    register(): void;
    unregister(): void;
};
declare function defineDynamicModule<S, A extends {
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
    register(): void;
    unregister(): void;
};
declare function defineDynamicModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}>(name: string, state: S, { mutations }: {
    mutations: M;
}): {
    mutations: ReturnedMutations<M>;
    state: S;
    register(): void;
    unregister(): void;
};
declare function defineDynamicModule<S, A extends {
    [x: string]: (context: any, payload?: any) => any;
}>(name: string, state: S, { actions }: {
    actions: A;
}): {
    actions: ReturnedActions<A>;
    state: S;
    register(): void;
    unregister(): void;
};
export { defineDynamicModule };
