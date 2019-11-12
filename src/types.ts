export type IsValidArg<T> = T extends unknown ? (keyof T extends never ? false : true) : true;
export type Dictionary<T> = { [x: string]: T };
export type KeepProperties<T, P> = Pick<T, { [K in keyof T]: T[K] extends P ? K : never }[keyof T]>;

export type inferMutations<T> = T extends (state: any, payload: infer P) => void
  ? IsValidArg<P> extends true
    ? (payload: P) => void
    : () => void
  : () => void;

export type inferActions<T extends (context: any, payload?: any) => void> = T extends (
  context,
  payload: infer P
) => any
  ? IsValidArg<P> extends true
    ? (payload: P) => ReturnType<T>
    : () => ReturnType<T>
  : ReturnType<T>;

export type inferGetters<T extends (state, getters?) => any> = T extends (
  state,
  getters?
) => infer R
  ? R
  : void;

export type ReturnedGetters<T extends any> = {
  [K in keyof T]: inferGetters<T[K]>;
};
export type ReturnedActions<T extends any> = {
  [K in keyof T]: inferActions<T[K]>;
};
export type ReturnedMutations<T extends any> = {
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
  updateState(params: Partial<S>): void;
  updateListItem<T extends keyof KeepProperties<S, any[]>>(
    key: T,
    identifier: S[T] extends Array<any> ? { [K in keyof S[T][0]]+?: S[T][0][K] } : any,
    data: S[T] extends Array<any> ? { [K in keyof S[T][0]]+?: S[T][0][K] } : any
  ): void;
  removeListItem<T extends keyof KeepProperties<S, any[]>>(
    key: T,
    identifier: S[T] extends Array<any> ? { [K in keyof S[T][0]]+?: S[T][0][K] } : any
  ): void;
  addListItem<T extends keyof KeepProperties<S, any[]>>(
    key: T,
    data: S[T] extends Array<any> ? { [K in keyof S[T][0]]+?: S[T][0][K] } : any
  ): void;
  concatList<T extends keyof KeepProperties<S, any[]>>(
    key: T,
    data: S[T] extends Array<any> ? S[T] : any
  );
};
