import { ReturnedMutations, ReturnedActions, ReturnedGetters, MutationsPayload, ActionsPayload, GettersPayload } from "./types";
declare const storeBuilder: import("vuex").Store<{}>;
declare function stateBuilder<S>(state: S, name: string): {
    registerMutations: <T extends MutationsPayload>(mutations: T) => ReturnedMutations<T>;
    registerActions: <T extends ActionsPayload>(actions: T) => ReturnedActions<T>;
    registerGetters: <T extends GettersPayload>(getters: T) => ReturnedGetters<T>;
    state: any;
};
declare function defineModule<S, M extends MutationsPayload, A extends ActionsPayload, G extends GettersPayload>(name: string, state: S, { actions, mutations, getters }: {
    actions: A;
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
};
declare function defineModule<S, M extends MutationsPayload, A extends ActionsPayload>(name: string, state: S, { actions, mutations }: {
    actions: A;
    mutations: M;
}): {
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
};
declare function defineModule<S, M extends MutationsPayload, G extends GettersPayload>(name: string, state: S, { mutations, getters }: {
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    mutations: ReturnedMutations<M>;
    state: S;
};
declare function defineModule<S, A extends ActionsPayload, G extends GettersPayload>(name: string, state: S, { actions, getters }: {
    actions: A;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    state: S;
};
declare function defineModule<S, M extends MutationsPayload>(name: string, state: S, { mutations }: {
    mutations: M;
}): {
    mutations: ReturnedMutations<M>;
    state: S;
};
declare function defineModule<S, A extends ActionsPayload>(name: string, state: S, { actions }: {
    actions: A;
}): {
    actions: ReturnedActions<A>;
    state: S;
};
export { storeBuilder, stateBuilder, defineModule };