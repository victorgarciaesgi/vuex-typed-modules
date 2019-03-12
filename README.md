# VueXT

A VueX wrapper to fully type your modules without more boilerplate!

I'm realy greatly inspired by [@mrcrowl](https://github.com/mrcrowl) work and his lib [vuex-typex](https://github.com/mrcrowl/vuex-typex)

I decided to take it a bit further and eliminating all boilerplate for declarating modules

# Usage

```bash
npm i vue-xt
#or
yarn add vue-xt
```

# Define Module

Create a `test.module.ts` in your store folder

```typescript
import { defineModule } from "vuex-xt";

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
import { storeBuilder } from "vue-xt";

new Vue({
  store: storeBuilder,
  render: h => h(App)
}).$mount("#app");
```

# Usage in your components or in other modules!

```vue
<template>
  <div class="hello">
    {{ count }}
    <button @click="increment">increment</button>
  </div>
</template>

<script lang="ts">
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

# Autocomplete and type safety exemple
