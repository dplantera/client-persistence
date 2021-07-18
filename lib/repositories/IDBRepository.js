var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EntityObject } from "../entities";
import { IDBClient } from "../driver/IDBClient";
import { log } from "../logging";
export class IDBRepository {
    constructor(repository, dbClient = new IDBClient()) {
        this.repository = repository;
        this.dbClient = dbClient;
        this.isJavascriptContext = false;
        this.isJavascriptContext = typeof repository == "string";
        this.storeName = typeof repository == "string" ? repository : repository.name;
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName, "readwrite");
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.add(item);
                request.onsuccess = (e) => {
                    var _a, _b, _c;
                    const id = (_a = item.id) !== null && _a !== void 0 ? _a : (_c = (_b = e) === null || _b === void 0 ? void 0 : _b.target) === null || _c === void 0 ? void 0 : _c.result;
                    item.id = id;
                    resolve(item);
                };
                request.onerror = () => {
                    reject(request.error);
                };
            }));
        });
    }
    createAll(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = [];
            yield items.reduce((prevPromise, next) => __awaiter(this, void 0, void 0, function* () {
                yield prevPromise;
                log.debug("adding to db: ", next);
                const newItem = yield this.create(next);
                created.push(newItem);
                return newItem;
            }), new Promise((resolve => resolve(items[0]))));
            return new Promise(resolve => resolve(created));
        });
    }
    updateAll(items) {
        return __awaiter(this, void 0, void 0, function* () {
            yield items.reduce((prevPromise, next) => __awaiter(this, void 0, void 0, function* () {
                yield prevPromise;
                log.debug("updating: ", next);
                return yield this.update(next);
            }), new Promise((resolve => resolve(items[0]))));
            return new Promise(resolve => resolve(true));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName, "readwrite");
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.delete(id);
                request.onsuccess = () => resolve(true);
                request.onerror = () => {
                    log.debug(request.error);
                    resolve(false);
                };
            }));
        });
    }
    update(item, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName, "readwrite");
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.put(item, id);
                request.onsuccess = () => resolve(true);
                request.onerror = () => {
                    log.debug(request.error);
                    resolve(false);
                };
            }));
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName);
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.get(id);
                request.onsuccess = () => resolve(this.transform(request.result));
                request.onerror = () => {
                    reject(request.error);
                };
            }));
        });
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName);
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.getAll(query);
                request.onsuccess = () => resolve(request.result.map(this.transform));
                request.onerror = () => {
                    reject(request.error);
                };
            }));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const storeTransaction = yield this.dbClient.storeTransaction(this.storeName);
            return new Promise(((resolve, reject) => {
                const request = storeTransaction.getAll();
                request.onsuccess = () => resolve(request.result.map(res => {
                    return this.transform(res);
                }));
                request.onerror = () => {
                    reject(request.error);
                };
            }));
        });
    }
    transform(object) {
        if (!object)
            return object;
        const repoType = this.getType();
        const newObj = Object.create(repoType.prototype);
        return Object.assign(newObj, object);
    }
    getType() {
        return typeof this.repository == "string" ? EntityObject : this.repository;
    }
}
