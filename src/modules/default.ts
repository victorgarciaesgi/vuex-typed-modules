import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, ActionBush } from '../types';
import { buildModifiers } from '../utils/modifiers';
import { setHelpers } from './helpers';
import cloneDeep from 'lodash/cloneDeep';
import { createModuleHook, VuexModuleHook } from './hooks';

export interface VuexModuleArgs<
  S extends Record<string, any>,
  G extends Vuex.GetterTree<S, any> = never,
  M extends Vuex.MutationTree<S> = never,
  A extends ActionBush<S> = never
> {
  name: string;
  state: S;
  getters?: G;
  mutations?: M;
  actions?: A;
  options?: Vuex.ModuleOptions;
  logger?: boolean;
}

export class VuexModule<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  G extends Vuex.GetterTree<S, any>,
  A extends ActionBush<S>
> {
  protected name!: string;
  protected initialState: S = {} as any;
  protected _getters?: Vuex.GetterTree<S, any>;
  protected _mutations?: Vuex.MutationTree<S>;
  protected _actions?: A;
  protected _options?: Vuex.ModuleOptions;
  protected _logger: boolean;
  protected _state!: S;

  protected store!: Vuex.Store<S>;

  public getters!: ReturnedGetters<G>;
  public actions!: ReturnedActions<A>;
  public mutations!: ReturnedMutations<M>;
  public state: S = {} as any;

  constructor({
    name,
    state,
    actions,
    getters,
    mutations,
    options,
    logger = true,
  }: VuexModuleArgs<S, G, M, A>) {
    Object.defineProperty(this, 'initialState', {
      enumerable: false,
      configurable: false,
      get() {
        return cloneDeep(state);
      },
      set() {},
    });
    this.name = name;
    this._state = cloneDeep(state);
    this._getters = getters;
    this._actions = actions;
    this._mutations = mutations;
    this._options = options;
    this._logger = logger;
  }

  public resetState() {
    this.store.commit(`${this.name}/resetState`, this.initialState);
  }
  public updateState(callback: ((state: S) => Partial<S> | void) | Partial<S>) {
    const storeState = this.store.state[this.name];
    let updatedState: Partial<S> | null = null;
    if (callback instanceof Function) {
      const returnedKeys = callback(storeState);
      if (returnedKeys) {
        updatedState = returnedKeys;
      }
    } else {
      updatedState = callback;
    }
    const stateToUpdate = updatedState ?? storeState;
    this.store.commit(`${this.name}/updateState`, stateToUpdate);
  }

  public extract() {
    return {
      name: this.name,
      state: this._state,
      getters: this._getters,
      actions: this._actions as any,
      mutations: this._mutations,
      options: this._options,
    };
  }
  protected activate(store: Vuex.Store<any>): void {
    let { name, actions, getters, mutations, state, options } = this.extract();
    this.store = store;

    if (store.hasModule(name)) {
      console.log(`%c Module "${name}" still active, skipping activation`, 'color: #4287f5');
      return;
    } else {
      const moduleName = name;
      if (mutations == null && mutations === undefined) {
        mutations = {};
      }
      mutations = setHelpers(mutations);
      store.registerModule(
        moduleName,
        {
          namespaced: true,
          actions,
          getters,
          mutations,
          state,
        },
        options
      );
      const { registerActions, registerGetters, registerMutations, reactiveState } = buildModifiers(
        store,
        this.name
      );
      this.mutations = registerMutations(this._mutations);
      this.actions = registerActions(this._actions);
      this.getters = registerGetters(this._getters);
      Object.defineProperty(this, 'state', {
        enumerable: true,
        configurable: true,
        get() {
          return reactiveState();
        },
      });
    }
  }

  public deploy(store: Vuex.Store<any>) {
    this.activate(store);
  }
}

export const createVuexModule = <
  S extends Record<string, any>,
  G extends Vuex.GetterTree<S, any>,
  M extends Vuex.MutationTree<S>,
  A extends ActionBush<S>
>(
  params: VuexModuleArgs<S, G, M, A>
): [VuexModule<S, M, G, A>, () => VuexModuleHook<S, M, G, A>] => {
  const defaultModule = new VuexModule(params);
  const moduleHook = createModuleHook(params);

  return [defaultModule, moduleHook];
};

// const test = new VuexModule({
//   name: 'zefez',
//   state: {
//     foo: 'bar',
//   },
//   mutations: {
//     boo(state) {
//       state.foo;
//     },
//   },
//   actions: {
//     test({ commit, state, getters }, test: string | null) {
//       state.foo;
//     },
//   },
// });

// test.actions.test();
