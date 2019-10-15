import * as Vuex from 'vuex';
import { VuexModule, VuexModuleArgs } from './Module';

export class VuexDynamicModule<S, G, M, A> extends VuexModule {
  private namespace: string;
  constructor({ namespace, ...rest }: VuexModuleArgs<S, G, M, A> & { namespace: string }) {
    super(rest);
    this.namespace = namespace;
  }

  public register(store: Vuex.Store<any>) {
    this.activate(store, this.namespace);
  }
}
