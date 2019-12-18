import * as Vuex from 'vuex';
import { ReturnedGetters, ReturnedActions, ReturnedMutations, SharedMutations } from './types';
import { buildModifiers } from './modifiers';
import { buildHelpers, setHelpers } from './Helpers';

export interface VuexModuleArgs<S, G, M, A> {
  name: string;
  state: S;
  getters?: G;
  mutations?: M;
  actions?: A;
  options?: Vuex.ModuleOptions;
}

export class VuexModule<
  S = any,
  M extends Vuex.MutationTree<S> = any,
  G extends Vuex.GetterTree<S, any> = any,
  A extends Vuex.ActionTree<S, any> = any
> {
  protected name!: string;
  protected _initialState!: S;
  protected _getters!: Vuex.GetterTree<S, any>;
  protected _mutations!: Vuex.MutationTree<S>;
  protected _actions!: A;
  protected _options: Vuex.ModuleOptions;

  public getters: ReturnedGetters<G>;
  public actions: ReturnedActions<A>;
  public mutations: ReturnedMutations<M>;
  public state: S;
  public helpers: SharedMutations<S>;

  constructor({ name, state, actions, getters, mutations, options }: VuexModuleArgs<S, G, M, A>) {
    this.name = name;
    this._initialState = state;
    this._getters = getters;
    this._actions = actions;
    this._mutations = mutations;
    this._options = options;
  }

  public extract() {
    return {
      name: this.name,
      state: this._initialState,
      getters: this._getters,
      actions: this._actions,
      mutations: this._mutations,
      options: this._options,
    };
  }
  protected activate(store: Vuex.Store<any>, namespace?: string): void {
    let { name, actions, getters, mutations, state, options } = this.extract();
    if (store.state[name]) {
      console.error(`A module with the name ${name} already exists`);
      return;
    }
    if (mutations == null && mutations === undefined) {
      mutations = {};
    }
    setHelpers(mutations, state);
    store.registerModule(
      (namespace ? [namespace, name] : name) as any,
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
    this.helpers = buildHelpers(store, this.name);
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

  public register(store: Vuex.Store<any>) {
    this.activate(store);
  }
}
