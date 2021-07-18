var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StoreConfig } from "./indexeddb.config";
import { getLogger } from "../logging";
const log = getLogger("IDBClient");
class DBVersion {
    constructor(defaultDbName) {
        this.defaultDbName = defaultDbName;
        this.dbVersionMap = {};
    }
    set(version, dbName = this.defaultDbName) {
        this.dbVersionMap[dbName] = version;
    }
    get(dbName = this.defaultDbName) {
        return this.dbVersionMap[dbName];
    }
}
export class IDBClient {
    constructor(storeConfig = StoreConfig.getInstance()) {
        this.storeConfig = storeConfig;
        const windowBrowser = window;
        this.indexedDB = windowBrowser.indexedDB || windowBrowser.mozIndexedDB || windowBrowser.webkitIndexedDB || windowBrowser.msIndexedDB || indexedDB;
        this.nameDbDefault = StoreConfig.NAME_DB_DEFAULT;
        IDBClient.dbVersion = new DBVersion(StoreConfig.NAME_DB_DEFAULT);
    }
    get version() {
        return IDBClient.dbVersion;
    }
    getDbName(store) {
        var _a;
        if (!store)
            return this.nameDbDefault;
        return ((_a = this.storeConfig.for(store)) === null || _a === void 0 ? void 0 : _a.database) || this.nameDbDefault;
    }
    deleteDb(dbName = this.getDbName()) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(((resolve, reject) => {
                const request = this.indexedDB.deleteDatabase(dbName);
                request.onsuccess = () => {
                    this.version.set(undefined, dbName);
                    resolve(true);
                };
                request.onerror = () => reject(request.error);
            }));
        });
    }
    connect(dbName, version, upgradeNeeded = function (e) {
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = this.indexedDB.open(dbName, version);
            return new Promise((resolve, reject) => {
                request.onblocked = (e) => reject(e);
                request.onupgradeneeded = upgradeNeeded;
                request.onerror = (e) => reject(request.error);
                request.onsuccess = (e) => resolve(request.result);
            });
        });
    }
    getDb(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const db = yield this.connect(dbName);
                    resolve(db);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    getDbForStore(storeName, params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const dbName = (_a = params.database) !== null && _a !== void 0 ? _a : this.getDbName(storeName);
            let db = yield this.getDb(dbName);
            let dbVersionCurrent = this.version.get(dbName);
            log.debug(" - version: " + ((_b = db.version) !== null && _b !== void 0 ? _b : -1) + " | " + (dbVersionCurrent !== null && dbVersionCurrent !== void 0 ? dbVersionCurrent : -1));
            if (!dbVersionCurrent)
                dbVersionCurrent = db.version;
            if (!db.objectStoreNames.contains(storeName))
                dbVersionCurrent++;
            if (db.version === dbVersionCurrent) {
                log.debug("no need to upgrade: ", storeName);
                return db;
            }
            this.version.set(dbVersionCurrent, dbName);
            // upgrade needed
            db.close();
            const { indices } = params;
            const indexedDb = this;
            return yield this.connect(dbName, dbVersionCurrent, function (e) {
                var _a, _b;
                let db = this.result;
                indexedDb.version.set(db.version, dbName);
                if (!db.objectStoreNames.contains(storeName)) {
                    const objectStore = db.createObjectStore(storeName, params);
                    log.debug("objectStore created: ", { objectStore, params });
                    if (!indices) {
                        return;
                    }
                    for (let index of indices) {
                        objectStore.createIndex(index.name, (_a = index.keyPath) !== null && _a !== void 0 ? _a : index.name, (_b = index.options) !== null && _b !== void 0 ? _b : {});
                        log.debug("index created: ", { index });
                    }
                }
            });
        });
    }
    storeTransaction(storeName, mode = "readonly", params = this.storeConfig.for(storeName)) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDbForStore(storeName, params);
            db.onversionchange = (e) => {
                log.debug("reloading db: " + storeName, e);
                db.close();
            };
            // make transaction
            const tx = db.transaction(storeName, mode);
            // tx.oncomplete = (e) => {log.debug("transaction ", e)}
            return tx.objectStore(storeName);
        });
    }
}
