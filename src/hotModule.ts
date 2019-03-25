import { storeBuilder } from "./builder";

export function enableHotReload(name, state, vuexModule, dynamic?: boolean) {
  if (module.hot) {
    module.hot.accept();
    if (storeBuilder.storedModules[name] == null && !dynamic) {
      storeBuilder.storeModule(name, state, vuexModule);
    } else if (storeBuilder.storedModules[name] != null) {
      storeBuilder.storeModule(name, state, vuexModule);
      storeBuilder.hotUpdate();
      console.log(
        `%c vuex-typed-modules %c ${
          dynamic ? "Dynamic" : ""
        } Module '${name}' hot reloaded %c`,
        "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#d64a17 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:transparent"
      );
    }
  }
}

export function disableHotReload(name) {
  storeBuilder.deleteStoreModule(name);
}
