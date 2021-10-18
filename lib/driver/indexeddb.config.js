var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getCollectedMetaInfo } from "./indexeddb.decorator";
export class StoreConfig {
    constructor() {
        this.storeConfig = new IDBStoreConfig(StoreConfig.NAME_DB_DEFAULT);
    }
    static get NAME_DB_DEFAULT() {
        return StoreConfig.__DEFAULT_DB_NAME;
    }
    ;
    static set NAME_DB_DEFAULT(databaseName) {
        StoreConfig.__DEFAULT_DB_NAME = databaseName;
        this.getInstance().storeConfig.switchDatabase(databaseName);
    }
    ;
    static getInstance() {
        if (!StoreConfig.instance)
            StoreConfig.init();
        return StoreConfig.instance;
    }
    static init() {
        StoreConfig.instance = new StoreConfig();
        const collectedMeta = getCollectedMetaInfo();
        Object.keys(collectedMeta).forEach(className => {
            const collectedInfo = collectedMeta[className];
            const { database, store } = collectedInfo, props = __rest(collectedInfo, ["database", "store"]);
            const dbName = database !== null && database !== void 0 ? database : StoreConfig.NAME_DB_DEFAULT;
            StoreConfig.instance.storeConfig.add(className, Object.assign(Object.assign({}, props), { name: store, database: dbName }));
        });
    }
    for(store) {
        return StoreConfig.getInstance().storeConfig.get(store);
    }
    add(configs) {
        configs.forEach(config => {
            StoreConfig.instance.storeConfig.add(config.store, config.storeConfig);
        });
    }
}
StoreConfig.__DEFAULT_DB_NAME = "default_db";
class IDBStoreConfig {
    constructor(defaultDbName) {
        this.storeParamsDefault = {
            keyPath: "id",
            autoIncrement: true,
            database: defaultDbName
        };
    }
    switchDatabase(database) {
        this.storeParamsDefault.database = database;
    }
    add(storeName, config = this.storeParamsDefault) {
        const storeNameLowerCase = storeName.toLowerCase();
        let storeConfig = this.get(storeNameLowerCase);
        if (storeConfig)
            IDBStoreConfig.STORE_CONFIGS[storeName] = Object.assign(Object.assign({}, storeConfig), config);
        else
            IDBStoreConfig.STORE_CONFIGS[storeName] = Object.assign(Object.assign({}, this.storeParamsDefault), config);
        return this;
    }
    get(storeName) {
        if (!IDBStoreConfig.STORE_CONFIGS[storeName])
            return this.storeParamsDefault;
        return IDBStoreConfig.STORE_CONFIGS[storeName];
    }
}
IDBStoreConfig.STORE_CONFIGS = {};
