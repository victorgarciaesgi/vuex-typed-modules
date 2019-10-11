import * as Vuex from 'vuex';
import {
  ActionsTree,
  GettersTree,
  ReturnedGetters,
  ReturnedActions,
  ReturnedMutations,
  SharedMutations,
  MutationsTree,
} from './types';
import { buildModifiers } from './modifiers';
import { buildHelpers } from './Helpers';

export interface VuexModuleArgs<S, G, M, A> {
  name: string;
  dynamic?: boolean;
  state: S;
  getters?: G;
  mutations?: M;
  actions?: A;
}

export class VuexModule<
  S = any,
  M extends MutationsTree<S> = any,
  G extends GettersTree<S> = any,
  A extends ActionsTree = any
> {
  private name!: string;
  private _initialState!: S;
  private _getters!: GettersTree<S>;
  private _mutations!: MutationsTree<S>;
  private _actions!: A;
  private _dynamic: boolean;

  public getters: ReturnedGetters<G>;
  public actions: ReturnedActions<A>;
  public mutations: ReturnedMutations<M>;
  public state: S;
  public helpers: SharedMutations<S>;

  constructor({
    name,
    state,
    actions,
    getters,
    mutations,
    dynamic = false,
  }: VuexModuleArgs<S, G, M, A>) {
    this.name = name;
    this._initialState = state;
    this._getters = getters;
    this._actions = actions;
    this._mutations = mutations;
  }

  public extract() {
    return {
      name: this.name,
      state: this._initialState,
      getters: this._getters,
      actions: this._actions,
      mutations: this._mutations,
    };
  }

  public register(store: Vuex.Store<any>) {
    let { name, actions, getters, mutations, state } = this.extract();
    store.registerModule(name, {
      namespaced: true,
      actions,
      getters,
      mutations,
      state,
    });
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
}
