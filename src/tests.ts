import Vuex, { CommitOptions, DispatchOptions, Store } from 'vuex';

type StoreDefaults = { mutations: any; getters: any; state: any; actions: any };

type GenerateTypedStoreReturn<T extends StoreDefaults> = Omit<
  Store<T['state']>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof T['mutations'], P extends Parameters<T['mutations'][K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<T['mutations'][K]>;
} & {
  dispatch<K extends keyof T['actions']>(
    key: K,
    payload?: Parameters<T['actions'][K]>[1],
    options?: DispatchOptions
  ): ReturnType<T['actions'][K]>;
} & {
  getters: {
    [K in keyof T['getters']]: ReturnType<T['getters'][K]>;
  };
};

const createTestStore = <T extends StoreDefaults>(options: T): GenerateTypedStoreReturn<T> =>
  new Vuex.Store({
    ...options,
  }) as unknown as GenerateTypedStoreReturn<T>;

export { createTestStore };
