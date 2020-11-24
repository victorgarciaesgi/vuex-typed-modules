import * as Vuex from 'vuex';
import { VuexModule } from './Module';
import { VuexDynamicModule } from './DynamicModule';
interface DataBaseOptions {
    logger?: boolean;
}
export declare class Database {
    private store;
    private modules;
    private options;
    constructor(options: DataBaseOptions);
    private install;
    deploy(vuexModules: (VuexModule | VuexDynamicModule)[]): (store: Vuex.Store<any>) => void;
    private createLogger;
}
export {};
