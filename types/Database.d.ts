import * as Vuex from 'vuex';
import { VuexModule } from './Module';
import { VuexDynamicModule } from './DynamicModule';
interface DataBaseOptions {
    logger?: boolean;
}
declare type DefaultModule = VuexModule<any, any, any, any> | VuexDynamicModule<any, any, any, any>;
export declare class Database {
    private store;
    private modules;
    private options;
    private loggerBlackList;
    constructor(options: DataBaseOptions);
    private install;
    deploy(vuexModules: DefaultModule[]): (store: Vuex.Store<any>) => void;
    private createLogger;
}
export {};
