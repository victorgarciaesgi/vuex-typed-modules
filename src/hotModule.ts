import { storeBuilder, storedModules } from './builder';

export function enableHotReload(name, state, vuexModule, dynamic?: boolean) {
  if (module.hot) {
    if (storedModules[name] == null && !dynamic) {
      storedModules[name] = {
        namespaced: true,
        state,
        ...vuexModule,
      };
    } else if (storedModules[name] != null) {
      storedModules[name] = {
        namespaced: true,
        state,
        ...vuexModule,
      };
      storeBuilder.hotUpdate({
        modules: {
          ...storedModules,
        },
      });
      console.log(
        `%c vuex-typed-modules %c ${dynamic ? 'Dynamic' : ''}Module '${name}' hot reloaded %c`,
        'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#d64a17 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent'
      );
    }
  }
}

export function disableHotReload(name) {
  delete storedModules[name];
}
