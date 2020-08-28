import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './Module';

export class VuexDynamicModule<
  S extends Record<string, any> = any,
  M extends Vuex.MutationTree<S> = any,
  G extends Vuex.GetterTree<S, any> = any,
  A extends Record<string, Vuex.ActionHandler<any, any>> = any
> extends VuexModule<S, M, G, A> {
  private namespace: string;
  private store: Vuex.Store<any>;
  constructor({ namespace, ...rest }: VuexModuleArgs<S, G, M, A> & { namespace?: string }) {
    super(rest);
    this.namespace = namespace;
  }

  public save(store: Vuex.Store<any>) {
    this.store = store;
  }

  public register(): void {
    this.activate(this.store, this.namespace);
  }

  public unregister(): void {
    this.store.unregisterModule((this.namespace ? [this.namespace, this.name] : this.name) as any);
  }
}
