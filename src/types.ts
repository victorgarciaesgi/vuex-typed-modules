import { Getter, GetterTree, ActionHandler, MutationTree, Store, Dispatch } from 'vuex';

export type IsValidArg<T> = T extends unknown
  ? keyof Exclude<T, undefined | null> extends never
    ? false
    : true
  : true;

export type Dictionary<T> = { [x: string]: T };
export type KeepProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>;

export type ParameterName<T extends (...args: [any, any]) => any> = T extends (
  context: any,
  ...args: infer P
) => any
  ? P
  : never;

export type inferMutations<T> = T extends (state: any, payload: infer P) => void
  ? IsValidArg<P> extends true
    ? (...args: ParameterName<T>) => void
    : () => void
  : () => void;

export type inferActions<T extends ActionHandler<any, any>> = T extends (
  context: any,
  payload: infer P
) => any
  ? IsValidArg<P> extends true
    ? (...args: ParameterName<T>) => ReturnType<T>
    : () => ReturnType<T>
  : ReturnType<T>;

export type inferGetters<T extends Getter<any, any>> = T extends (
  state: any,
  getters?: any
) => infer R
  ? R
  : void;

export interface RichActionContext<
  S,
  G extends ReturnedGetters<any>,
  M extends ReturnedMutations<any>
> {
  dispatch: Dispatch;
  mutations: M;
  state: S;
  getters: G;
}
export type RichAction<S, G extends ReturnedGetters<any>, M extends ReturnedMutations<any>> = (
  this: Store<any>,
  injectee: RichActionContext<S, G, M>,
  payload?: any
) => any;

export interface RichActionTree<
  S,
  G extends ReturnedGetters<any>,
  M extends ReturnedMutations<any>
> {
  [x: string]: RichAction<S, G, M>;
}

export type ActionBush<S> = Record<string, ActionHandler<S, any>>;

export type ReturnedGetters<T extends GetterTree<any, any>> = {
  [K in keyof T]: inferGetters<T[K]>;
};
export type ReturnedActions<T extends ActionBush<any>> = {
  [K in keyof T]: inferActions<T[K]>;
};
export type ReturnedMutations<T extends MutationTree<any>> = {
  [K in keyof T]: inferMutations<T[K]>;
};

export type StoreModuleType = {
  getters?: ReturnedGetters<any>;
  actions?: ReturnedActions<any>;
  mutations?: ReturnedMutations<any>;
  state: any;
} & SharedMutations<any>;

export type SharedMutations<S> = {
  resetState(): void;
  updateState(callback: (state: S) => Partial<S>): void;
};
