import * as Vuex from "vuex";
import { VuexModule } from "./Module";
interface DataBaseOptions {
    logger?: boolean;
}
export declare class Database {
    private store;
    private modules;
    private options;
    constructor(options: DataBaseOptions);
    private install;
    deploy(vuexModules: VuexModule[]): (store: Vuex.Store<any>) => void;
    private createLogger;
}
export {};
