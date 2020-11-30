import { log } from 'console';
import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './default';

export type ModuleToInstance<TModule> = TModule extends VuexDynamicModule<
  infer S,
  infer M,
  infer G,
  infer A
>
  ? DynamicModuleInstance<S, M, G, A>
  : TModule;

export class VuexDynamicModule<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  G extends Vuex.GetterTree<S, any>,
  A extends Record<string, Vuex.ActionHandler<any, any>>
> {
  private nestedName?: string;
  private namespaceName!: string;
  private module: DynamicModuleInstance<any, any, any, any>;
  private state!: S;
  private getters!: any;
  private mutations!: any;
  private actions!: any;
  private options?: Vuex.ModuleOptions;
  private store: Vuex.Store<any>;

  protected _logger: boolean;

  private get params() {
    return {
      state: this.state,
      getters: this.getters,
      mutations: this.mutations,
      actions: this.actions,
      options: this.options,
    };
  }

  get name(): string {
    if (this.nestedName) {
      return `${this.namespaceName}-${this.nestedName}`;
    }

    return this.namespaceName;
  }

  constructor({
    name,
    mutations,
    state,
    actions,
    getters,
    options,
    logger = true,
  }: VuexModuleArgs<S, G, M, A>) {
    this.namespaceName = name;
    this.state = state;
    this.getters = getters;
    this.actions = actions;
    this.mutations = mutations;
    this.options = options;
    this._logger = logger;
  }

  public save(store: Vuex.Store<any>) {
    this.store = store;
  }

  public register(moduleName?: string): DynamicModuleInstance<S, M, G, A> {
    this.nestedName = moduleName;
    let fullName = this.name;
    this.module = new DynamicModuleInstance({ name: fullName, ...this.params, store: this.store });
    return this.module;
  }
}

export class DynamicModuleInstance<
  S extends Record<string, any>,
  M extends Vuex.MutationTree<S>,
  G extends Vuex.GetterTree<S, any>,
  A extends Record<string, Vuex.ActionHandler<any, any>>
> extends VuexModule<S, M, G, A> {
  private nestedName?: string;
  constructor({ store, ...args }: VuexModuleArgs<S, G, M, A> & { store: Vuex.Store<S> }) {
    super(args);
    this.store = store;
    this.activate(store);
  }

  public unregister(): void {
    this.store.unregisterModule(
      (this.nestedName ? [this.name, this.nestedName] : this.name) as any
    );
    this.nestedName = '';
    this.name = this.name.split('/')[0];
  }
}
