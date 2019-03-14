export type IsValidArg<T> = T extends object
  ? (keyof T extends never ? false : true)
  : true;

export type inferMutations<T> = T extends (state: any, payload: infer P) => void
  ? IsValidArg<P> extends true
    ? (payload: P) => void
    : () => void
  : () => void;

export type inferActions<
  T extends (context: any, payload?: any) => void
> = T extends (context, payload: infer P) => any
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

export type MutationsPayload = {
  [x: string]: (state: any, payload?: any) => void;
};
export type ActionsPayload = {
  [x: string]: (context: any, payload?: any) => any;
};
export type GettersPayload = {
  [x: string]: (state?: any, getters?: any) => any;
};

export type ReturnedGetters<T extends any> = {
  [K in keyof T]: inferGetters<T[K]>
};
export type ReturnedActions<T extends any> = {
  [K in keyof T]: inferActions<T[K]>
};
export type ReturnedMutations<T extends any> = {
  [K in keyof T]: inferMutations<T[K]>
};
