import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './Module';

export type ModuleToInstance<TModule> = TModule extends VuexDynamicModule<
  infer S,
  infer M,
  infer G,
  infer A
>
  ? DynamicModuleInstance<S, M, G, A>
  : TModule;

export class VuexDynamicModule<
  S extends Record<string, any> = any,
  M extends Vuex.MutationTree<S> = any,
  G extends Vuex.GetterTree<S, any> = any,
  A extends Record<string, Vuex.ActionHandler<any, any>> = any
> {
  private nestedName?: string;
  private namespaceName!: string;
  private module: DynamicModuleInstance;
  private state!: S;
  private getters!: any;
  private mutations!: any;
  private actions!: any;
  private options: Vuex.ModuleOptions;
  private store: Vuex.Store<any>;

  private get params() {
    return {
      state: this.state,
      getters: this.getters,
      mutations: this.mutations,
      actions: this.actions,
      options: this.options,
    };
  }

  constructor({ name, mutations, state, actions, getters, options }: VuexModuleArgs<S, G, M, A>) {
    this.namespaceName = name;
    this.state = state;
    this.getters = getters;
    this.actions = actions;
    this.mutations = mutations;
    this.options = options;
  }

  public save(store: Vuex.Store<any>) {
    this.store = store;
  }

  public register(moduleName?: string): DynamicModuleInstance<S, M, G, A> {
    this.nestedName = moduleName;
    let fullName = this.nestedName
      ? `${this.namespaceName}-${this.nestedName}`
      : this.namespaceName;
    this.module = new DynamicModuleInstance({ name: fullName, ...this.params, store: this.store });
    this.module.register();
    return this.module;
  }
}

export class DynamicModuleInstance<
  S extends Record<string, any> = any,
  M extends Vuex.MutationTree<S> = any,
  G extends Vuex.GetterTree<S, any> = any,
  A extends Record<string, Vuex.ActionHandler<any, any>> = any
> extends VuexModule<S, M, G, A> {
  private nestedName?: string;
  private store: Vuex.Store<any>;
  constructor({ store, ...args }: VuexModuleArgs<S, G, M, A> & { store: Vuex.Store<any> }) {
    super(args);
    this.store = store;
  }

  public register(): void {
    this.activate(this.store);
  }

  public unregister(): void {
    this.store.unregisterModule(
      (this.nestedName ? [this.name, this.nestedName] : this.name) as any
    );
    this.nestedName = '';
    this.name = this.name.split('/')[0];
  }
}
