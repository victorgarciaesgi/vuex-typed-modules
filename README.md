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

A VueX wrapper to fully type your modules without more boilerplate

I'm realy greatly inspired by [@mrcrowl](https://github.com/mrcrowl) work and his lib [vuex-typex](https://github.com/mrcrowl/vuex-typex)

I decided to take it a bit further and eliminating all boilerplate for declarating modules

It also comes with an vuex action logger

![actionsloggers](https://github.com/victorgarciaesgi/vuex-typed-modules/blob/master/captures/actionlogger.png?raw=true)

# Breaking changes in 3.0

- `updateState` now accepts a callback with the state as param. All others update helpers removed

## Installation

```bash
npm i vuex-typed-modules
#or
yarn add vuex-typed-modules
```

# Usage

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

## Module implementation

Then in your `main.ts`

```typescript
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
import * as Modules from '~/modules';

const database = new Database({ logger: process.browser });
const modules = Object.keys(Modules).map((key) => Modules[key]);
export const plugins = [database.deploy(modules)];

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

## Dynamic Modules

For dynamic modules, simply call the function `VuexDynamicModule` instead

```typescript
import { VuexDynamicModule } from 'vuex-typed-modules';

export const testModule = new VuexDynamicModule({
  name: 'testModule',
  state: {
    count: 1,
  },
  actions: {
    // Due to limitions of Typescript, I can't provide typings for infered mutations and getters inside the same object. It would make an infinite loop (I tried).
    // For dynamic object you can fallback on "commit" "dispatch" and "getters"
    exemple({ state, commit, dispatch, getters }, param: string) {
      // ...
    },
  },
});
```

### Usage

```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { testModule } from '~/modules';

const ChildStoreModule = testModule.instance('child-store');

@Component
export default class TestView extends Vue {
  get count() {
    return ChildStoreModule.state.count;
  }

  created() {
    ChildStoreModule.register();
  }

  beforeDestroy() {
    ChildStoreModule.unregister();
  }
}
</script>
```

## Default module helpers

Vuex types modules also add helpers functions on top of your module to prevent from writing short mutations

```typescript
YourModule.helpers.resetState();
// Reset your module to the initial State
```

```typescript
// You can specify only the property you want to update
YourModule.helpers.updateState({
  count: 3,
});

// You can also give a callback function to have access to the current state
YourModule.helpers.updateState((state) => ({
  count: state.count + 2,
}));

// And also mutate the state directly (A bit heavier on the update)
YourModule.helpers.updateState((state) => {
  state.count++;
});
```
