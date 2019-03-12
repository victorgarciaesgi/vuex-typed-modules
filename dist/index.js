import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
export const storeBuilder = new Vuex.Store({});
function createModuleTriggers(name, initialState) {
    function commit(handler) {
        return payload => storeBuilder.commit(name + "/" + handler.name, payload);
    }
    function dispatch(handler) {
        return payload => storeBuilder.dispatch(name + "/" + handler.name, payload);
    }
    function read(handler) {
        return () => storeBuilder.getters[name + "/" + handler.name];
    }
    return {
        commit,
        dispatch,
        read,
        get state() {
            return storeBuilder.state[name];
        }
    };
}
export function stateBuilder(state, name) {
    const b = createModuleTriggers(name, state);
    const registerMutations = (mutations) => {
        let renderedMutations = {};
        if (mutations) {
            Object.keys(mutations).map(m => {
                renderedMutations[m] = b.commit(mutations[m]);
            });
        }
        return renderedMutations;
    };
    const registerActions = (actions) => {
        let renderedActions = {};
        if (actions) {
            Object.keys(actions).map(m => {
                renderedActions[m] = b.dispatch(actions[m]);
            });
        }
        return renderedActions;
    };
    const registerGetters = (getters) => {
        let renderedGetters = {};
        if (getters) {
            Object.keys(getters).map((m) => {
                Object.defineProperty(renderedGetters, m, {
                    get() {
                        return b.read(getters[m])();
                    }
                });
            });
            console.log(renderedGetters);
        }
        return renderedGetters;
    };
    return {
        registerMutations,
        registerActions,
        registerGetters,
        state: b.state
    };
}
export function defineModule(name, state, vuexModule) {
    storeBuilder.registerModule(name, {
        namespaced: true,
        state,
        ...vuexModule
    });
    const { registerGetters, registerMutations, registerActions, state: newState } = stateBuilder(state, name);
    return {
        mutations: registerMutations(vuexModule.mutations),
        actions: registerActions(vuexModule.actions),
        getters: registerGetters(vuexModule.getters),
        get state() {
            return newState;
        }
    };
}
//# sourceMappingURL=index.js.map