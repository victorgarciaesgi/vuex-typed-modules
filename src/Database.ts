import * as Vuex from 'vuex';
import { VuexModule } from './Module';
import { setHelpers } from './Helpers';
import { VuexDynamicModule } from './DynamicModule';

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

  private install(vuexModules: (VuexModule | VuexDynamicModule)[]): void {
    vuexModules.forEach((vuexmodule) => {
      if (vuexmodule instanceof VuexDynamicModule) {
        vuexmodule.save(this.store);
      } else {
        vuexmodule.deploy(this.store);
      }
    });
  }

  public deploy(vuexModules: (VuexModule | VuexDynamicModule)[]) {
    return (store: Vuex.Store<any>): void => {
      this.store = store;
      this.install(vuexModules);
      if (this.options.logger) this.createLogger();
    };
  }

  private createLogger() {
    if (this.options.logger) {
      this.store.subscribeAction({
        before: (action, state) => {
          const moduleName = action.type.split('/')[0];
          const type = action.type.split('/')[1];
          console.groupCollapsed(
            `%c Vuex Action %c ${moduleName} %c ${type ? `${type}` : '-'} %c`,
            'background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#fff;padding: 1px;color: #451382',
            'background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff',
            'background:transparent'
          );
          console.log('PAYLOAD', action.payload);
          console.log('STATE', state);
          console.groupEnd();
        },
      });
    }
  }
}
