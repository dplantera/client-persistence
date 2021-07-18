export declare type TStoreIndex = {
    name: string;
    keyPath?: string | string[];
    options?: IDBIndexParameters;
};
export declare type TStoreParameters = IDBObjectStoreParameters & {
    database: string;
    name?: string;
    indices?: Array<TStoreIndex>;
};
export declare class StoreConfig {
    static readonly NAME_DB_DEFAULT = "default_db";
    private static instance;
    private storeConfig;
    private constructor();
    static getInstance(): StoreConfig;
    private static init;
    for(store: string): any;
}
export interface IStoreConfig {
    add(storeName: string, config: Partial<TStoreParameters>): IStoreConfig;
    get(store: string): any;
}
