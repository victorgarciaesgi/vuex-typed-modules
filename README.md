# Vuex-typed-modules

A VueX wrapper to fully type your modules without more boilerplate!

I'm realy greatly inspired by [@mrcrowl](https://github.com/mrcrowl) work and his lib [vuex-typex](https://github.com/mrcrowl/vuex-typex)

I decided to take it a bit further and eliminating all boilerplate for declarating modules

It's working with dynamic modules too

# Usage

```bash
npm i vuex-typed-modules
#or
yarn add vuex-typed-modules
```

# Define Module

Create a `test.module.ts` in your store folder

```typescript
import { defineModule } from "vuex-typed-modules";

interface ItestState {
  count: number;
}

const state: ItestState = {
  count: 1
};

const getters = {
  count(state: ItestState) {
    return state.count;
  }
};

const mutations = {
  addCount(state: ItestState, number: number) {
    state.count += number;
  }
};

export const testModule = defineModule("testModule", state, {
  getters,
  mutations
});
```

# Module implementation

Then in your `main.ts`

```typescript
import { storeBuilder } from "vuex-typed-modules";

new Vue({
  store: storeBuilder,
  render: h => h(App)
}).$mount("#app");
```

# Usage in your components or in other modules!

```html
<template>
  <div class="hello">
    {{ count }}
    <button @click="increment">increment</button>
  </div>
</template>
```

```typescript
import { Component, Prop, Vue } from "vue-property-decorator";
import { testModule } from "@/store/test.module";

@Component
export default class Home extends Vue {
  get count() {
    return testModule.getters.count;
  }

  increment() {
    testModule.mutations.addCount(2);
  }
}
```

# Dynamic Modules

For dynamic modules, simply call the function `defineDynamicModule` instead

```typescript
export const testModule = defineDynamicModule("testModule", state, {
  getters,
  mutations
});
```

Then in your component when you need to activate the module

```typescript
import { Component, Prop, Vue } from "vue-property-decorator";
import { testModule } from "@/store/test.module";

@Component
export default class Home extends Vue {
  get count() {
    return testModule.getters.count;
  }

  increment() {
    testModule.mutations.addCount(2);
  }

  created() {
    testModule.register();
  }

  destroyed() {
    testModule.unregister();
  }
}
```

# Autocomplete and type safety exemple

The module show only what you gave him

![autocomplete1](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete1.png?raw=true)

It suggests all the related mutations/getters/actions/state

![autocomplete2](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete2.png?raw=true)

It shows correctly what each function returns

![autocomplete3](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete3.png?raw=true)

And it keeps the call signature of the original function

![autocomplete4](https://github.com/victorgarciaesgi/Vuex-typed-modules/blob/master/captures/autocomplete4.png?raw=true)

```

```
