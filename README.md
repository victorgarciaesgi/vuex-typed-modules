# 🧰 vuex-typed-modules

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads][npm-total-downloads-src]][npm-downloads-href]
<img src='https://img.shields.io/npm/l/vuex-typed-modules.svg'>

[npm-version-src]: https://img.shields.io/npm/v/vuex-typed-modules.svg
[npm-version-href]: https://www.npmjs.com/package/vuex-typed-modules
[npm-downloads-src]: https://img.shields.io/npm/dm/vuex-typed-modules.svg
[npm-total-downloads-src]: https://img.shields.io/npm/dt/vuex-typed-modules.svg
[npm-downloads-href]: https://www.npmjs.com/package/vuex-typed-modules

A VueX 3 & 4 wrapper that provides type safe hooks and handlers to your Vuex Store modules with less code!

> 4.x Support Vue 2 & 3, and Vuex 3 & 4 and added composition-api support (Thanks to `vue-demi`)

> 3.x Working with Vue 2, and Vue 3 with Vuex4 (but not hooks)

# Breaking changes in 4.x

- v4.x is still compatible with the 3.x api `new VuexModule` but declaration changes if you want to use composition-api

# Breaking changes in 3.x

- `updateState` now accepts a callback with the state as param. All others update helpers removed

## Installation

```bash
npm i vuex-typed-modules
#or
yarn add vuex-typed-modules
```

# Usage for `4.x`

## Define Module and hook

```typescript
import { createVuexModule } from 'vuex-typed-modules';

export const [testModule, useTestModule] = createVuexModule({
  name: 'testModule',
  state: {
    count: 1,
  },
  mutations: {
    addCount(state, number: number) {
      state.count += number;
    },
  },
  actions: {
    async addCountAsync({state}, count: number): Promise<void> {
      await myAsyncFunction(count);
      // Calling mutation
      testModule.mutations.addCount(count);
    },
  },
});
```

## Module declaration (For 4.x and 3.x)

In your `main.ts`

```typescript
// exemple for Vue 2
import { Database } from "vuex-typed-modules";
import { testModule } from '~modules'

const database = new Database({ logger: true });
const store = new Vuex.Store({
  plugins: [database.deploy([testModule])];
})

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
```

## For Nuxt.js

```typescript
// store/index.ts
import { testModule } from '~modules';

const database = new Database({ logger: process.browser });
export const plugins = [database.deploy([testModule])];

export const state = () => ({});
```

## Usage in your components or in other modules!

```html
<template>
  <div class="hello">
    {{ count }}
    <button @click="increment">increment</button>
  </div>
</template>
```

```typescript
import { defineComponent, onBeforeUnmount } from 'vue';
import { useTestModule } from '~/modules';

export default defineComponent({
  name: 'Home',
  setup() {
    const {
      state: { count },
      actions: { increment },
    } = useTestModule();

    return {
      count,
      increment,
    };
  },
});
```

## Dynamic Modules

For dynamic modules, use `createVuexDynamicModule` instead

```typescript
import { createVuexDynamicModule } from 'vuex-typed-modules';

// (Exemple of advanced structure, this is not required)
type TypedState<T = string> = {
  count: number;
  type: T | null;
};

export const testModule = createVuexDynamicModule({
  name: 'testModule',
  state: {
    count: 1,
    type: null,
  } as TypedState,
  actions: {
    // Due to limitions of Typescript, I can't provide typings for infered mutations and getters inside the same object.
    // It would make an infinite loop (I tried).
    // For dynamic module you can fallback on "commit" "dispatch" and "getters"
    exemple({ state, commit, dispatch, getters }, param: string) {
      // ...
    },
  },
});
```

### Usage

```vue
<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue';
import { testModule } from '~/modules';

const [ChildStoreModule, useChildStoreModule] = testModule.instance('child-store');
// Or if you use advanced types
const [ChildStoreModule, useChildStoreModule] =
  testModule.instance<TypedState<'child'>>('child-store');
// Dot not declare it in other files, only import it from here

export default defineComponent({
  name: 'TestView',
  setup() {
    ChildStoreModule.register();
    const {
      state: { count },
    } = useChildStoreModule();

    onBeforeUnmount(() => {
      ChildStoreModule.unregister();
    });

    return {
      count,
    };
  },
});
</script>
```

## Default module helpers

Vuex types modules also add helpers functions on top of your module to prevent from writing short mutations

```typescript
testModule.resetState();
// Reset your module to the initial State
```

```typescript
// You can specify only the property you want to update
testModule.updateState({
  count: 3,
});

// You can also give a callback function to have access to the current state
testModule.updateState((state) => ({
  count: state.count + 2,
}));

// And also mutate the state directly (A bit heavier on the update)
testModule.updateState((state) => {
  state.count++;
});
```

# -------------------------------------------

# Usage for `3.x`

## Define Module

Create a `test.module.ts` in your store folder

```typescript
import { VuexModule } from 'vuex-typed-modules';

export const testModule = new VuexModule({
  name: 'testModule',
  state: {
    count: 1,
  },
  mutations: {
    addCount(state, number: number) {
      state.count += number;
    },
  },
  actions: {
    async addCountAsync(_, count: number): Promise<void> {
      await myAsyncFunction(count);
      // Calling mutation
      testModule.mutations.addCount(count);
    },
  },
});
```

## Usage in your components or in other modules!

```html
<template>
  <div class="hello">
    {{ count }}
    <button @click="increment">increment</button>
  </div>
</template>
```

```typescript
import { Component, Prop, Vue } from 'vue-property-decorator';
import { testModule } from '~/modules';

@Component
export default class Home extends Vue {
  get count() {
    return testModule.getters.count;
  }

  async increment() {
    await testModule.actions.addCountAsync(2);
  }
}
```
