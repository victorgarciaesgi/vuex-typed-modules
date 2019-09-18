import * as Vuex from "vuex";
import { VuexModule } from "./Module";
import { setHelpers } from "./Helpers";

interface DataBaseOptions {
  logger?: boolean;
}

export class Database {
  private store!: Vuex.Store<any>;
  private modules: (Vuex.Module<any, any> & { name: string })[] = [];
  private options!: DataBaseOptions;

  constructor(options: DataBaseOptions) {
    this.options = options;
  }

  private install(vuexModules: VuexModule[]): void {
    vuexModules.forEach(vuexmodule => {
      let { name, actions, getters, mutations, state } = vuexmodule.extract();
      if (this.modules.find(mod => mod.name === name)) {
        console.error(`A module with the name ${name} already exists`);
        return;
      }
      if (mutations == null && mutations === undefined) {
        mutations = {};
        setHelpers(mutations, state);
      }

      this.store.registerModule(name, {
        namespaced: true,
        actions,
        getters,
        mutations,
        state
      });

      vuexmodule.register(this.store);
    });
  }

  public deploy(vuexModules: VuexModule[]) {
    return (store: Vuex.Store<any>): void => {
      this.store = store;
      this.install(vuexModules);
      if (this.options.logger) this.createLogger();
    };
  }

  private createLogger() {
    this.store.subscribeAction({
      before: (action, state) => {
        const moduleName = action.type.split("/")[0];
        const type = action.type.split("/")[1];
        console.groupCollapsed(
          `%c Vuex Action %c ${moduleName} %c ${type} %c`,
          "background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
          "background:#fff;padding: 1px;color: #451382",
          "background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff",
          "background:transparent"
        );
        console.log("PAYLOAD", action.payload);
        console.log("STATE", state);
        console.groupEnd();
      }
    });
  }
}
