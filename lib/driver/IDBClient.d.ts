import { StoreConfig, TStoreParameters } from "./indexeddb.config";
declare class DBVersion {
    defaultDbName: string;
    private dbVersionMap;
    constructor(defaultDbName: string);
    set(version: number | undefined, dbName?: string): void;
    get(dbName?: string): number | undefined;
}
export declare class IDBClient {
    readonly storeConfig: StoreConfig;
    private static dbVersion;
    private indexedDB;
    nameDbDefault: string;
    constructor(storeConfig?: StoreConfig);
    get version(): DBVersion;
    private getDbName;
    deleteDb(dbName?: string): Promise<boolean>;
    connect(dbName: string, version?: number, upgradeNeeded?: (this: IDBOpenDBRequest, e: Event) => void): Promise<IDBDatabase>;
    getDb(dbName: string): Promise<IDBDatabase>;
    getDbForStore(storeName: string, params: TStoreParameters): Promise<IDBDatabase>;
    storeTransaction(storeName: string, mode?: IDBTransactionMode, params?: TStoreParameters): Promise<IDBObjectStore>;
}
export {};
