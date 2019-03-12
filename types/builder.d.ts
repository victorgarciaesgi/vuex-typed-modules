import { ReturnedMutations, ReturnedActions, ReturnedGetters } from "./types";
declare const storeBuilder: import("vuex").Store<{}>;
declare function stateBuilder<S>(state: S, name: string): {
    registerMutations: <T extends {
        [x: string]: (state: any, payload: any) => void;
    }>(mutations: T) => ReturnedMutations<T>;
    registerActions: <T extends {
        [x: string]: (context: any, payload: any) => any;
    }>(actions: T) => ReturnedActions<T>;
    registerGetters: <T extends {
        [x: string]: (state: any) => void;
    }>(getters: T) => ReturnedGetters<T>;
    state: any;
};
declare function defineModule<S, M extends {
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
declare function defineModule<S, M extends {
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
declare function defineModule<S, M extends {
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
declare function defineModule<S, A extends {
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
declare function defineModule<S, M extends {
    [x: string]: (state: any, payload?: any) => void;
}>(name: string, state: S, { mutations }: {
    mutations: M;
}): {
    mutations: ReturnedMutations<M>;
    state: S;
};
declare function defineModule<S, A extends {
    [x: string]: (context: any, payload?: any) => any;
}>(name: string, state: S, { actions }: {
    actions: A;
}): {
    actions: ReturnedActions<A>;
    state: S;
};
export { storeBuilder, stateBuilder, defineModule };
