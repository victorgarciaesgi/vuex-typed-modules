import { storeBuilder, stateBuilder } from "./";
function defineDynamicModule(name, state, vuexModule) {
    function register() {
        storeBuilder.registerModule(name, {
            namespaced: true,
            state,
            ...vuexModule
        });
    }
    function unregister() {
        storeBuilder.unregisterModule(name);
    }
    const { registerGetters, registerMutations, registerActions, state: newState } = stateBuilder(state, name);
    return {
        mutations: registerMutations(vuexModule.mutations),
        actions: registerActions(vuexModule.actions),
        getters: registerGetters(vuexModule.getters),
        get state() {
            return newState;
        },
        register,
        unregister
    };
}
export { defineDynamicModule };
