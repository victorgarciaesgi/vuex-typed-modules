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

const mutations = {
  addCount(state, number: number) {
    state.count += number;
  },
};

const actions = {
  async addCountAsync(context, count: number): Promise<void> {
    await myAsyncFunction(count);
    // Calling mutation
    testModule.mutations.addCount(count);
  },
};

export const testModule = new VuexModule({
  name: 'testModule',
  state: {
    count: 1,
  },
  mutations,
  actions,
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
export const testModule = new VuexDynamicModule({
  name: 'testModule',
  state: {
    count: 1,
  },
});
```

### Usage

```vue
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { testModule } from '~/modules';

@Component
export default class TestView extends Vue {
  readonly module = testModule.register('child-store');

  get count() {
    return this.module.state.count;
  }

  beforeDestroy() {
    this.module.unregister();
  }
}
</script>
```

## Default module helpers

Vuex types modules also add 2 helpers functions on top of your module

```typescript
YourModule.helpers.resetState();
```

will reset your module to the initial State

```typescript
YourModule.helpers.updateState({
  count: 3,
});
```

Is like a mutation wrapper arround all your module state for simple state change (With type check too)

```typescript
YourModule.helpers.addListItem('users', { id: 2, name: 'Test' });
```

Will add an item to the list of your choice (Fully typed)

```typescript
YourModule.helpers.removeListItem('users', { id: 2 });
```

Will remove an item from a list with the help of an identifier

```typescript
YourModule.helpers.updateListItem('users', { id: 2 }, { name: 'Test2' });
```

Will update an item from a list with the help of an identifier

```typescript
YourModule.helpers.concatList('users', [{ id: 5, name: 'Bar' }]);
```

Will concate an array with an list of your state

## Autocomplete and type safety exemple

The module show only what you gave him

![autocomplete1](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete1.png?raw=true)

It suggests all the related mutations/getters/actions/state

![autocomplete2](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete2.png?raw=true)

It shows correctly what each function returns

![autocomplete3](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete3.png?raw=true)

And it keeps the call signature of the original function

![autocomplete4](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete4.png?raw=true)
