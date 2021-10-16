"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { IDBRepository } = require("./IDBRepository");
const { StoreConfig } = require("../driver/indexeddb.config");
require("fake-indexeddb/auto");
const { IDBClient } = require("../driver/IDBClient");
const idbClient = new IDBClient();
function resetDefaultDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield idbClient.deleteDb();
    });
}
describe("IDBRepository in vanilla javascript", () => {
    const NAME_REPOSITORY = "data";
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield resetDefaultDatabase();
    }));
    it("can create", () => __awaiter(void 0, void 0, void 0, function* () {
        const dataStore = new IDBRepository(NAME_REPOSITORY);
        const savedData = yield dataStore.create({ name: "test", value: 123 });
        expect(savedData).toEqual({ id: 1, name: "test", value: 123 });
    }));
    it("can retrieve", () => __awaiter(void 0, void 0, void 0, function* () {
        const dataStore = new IDBRepository(NAME_REPOSITORY);
        const toSaveWithId = { id: "uuid-1", name: "test1", value: 123 };
        const toSaveWithoutId = { name: "test2", value: 321 };
        yield dataStore.create(toSaveWithId);
        yield dataStore.create(toSaveWithoutId);
        expect(yield dataStore.getAll()).toEqual([toSaveWithoutId, toSaveWithId]);
        expect(yield dataStore.getById(toSaveWithId.id)).toEqual(toSaveWithId);
        expect(yield dataStore.get(toSaveWithoutId.id)).toEqual([toSaveWithoutId]);
        const dataStoreCopy = new IDBRepository(NAME_REPOSITORY);
        expect(yield dataStoreCopy.getById(toSaveWithId.id)).toEqual(toSaveWithId);
    }));
    it("only the repoName and Database matters not the IDBRepository instance", () => __awaiter(void 0, void 0, void 0, function* () {
        const repoName = NAME_REPOSITORY;
        const dataStoreInstance1 = new IDBRepository(repoName);
        const dataStoreInstance2 = new IDBRepository(repoName);
        const dataStoreInstance3 = new IDBRepository(repoName);
        const dataA = { id: 1, name: "test A", value: 123 };
        const dataB = { id: 2, name: "test B", value: 321 };
        yield dataStoreInstance1.create(dataA);
        yield dataStoreInstance2.create(dataB);
        expect(yield dataStoreInstance3.getAll()).toEqual([dataA, dataB]);
    }));
});
describe("Only the repoName/Store matters not the IDBRepository instance or Database", () => {
    beforeEach(() => {
        resetDefaultDatabase();
    });
    it("REPOSITORY INSTANCE has no impact on results within a DATABASE", () => __awaiter(void 0, void 0, void 0, function* () {
        const repoName = "data";
        const dataStoreInstance1 = new IDBRepository(repoName);
        const dataStoreInstance2 = new IDBRepository(repoName);
        const dataStoreInstance3 = new IDBRepository(repoName);
        const dataA = { id: 1, name: "test A", value: 123 };
        const dataB = { id: 2, name: "test B", value: 321 };
        yield dataStoreInstance1.create(dataA);
        yield dataStoreInstance2.create(dataB);
        expect(yield dataStoreInstance3.getAll()).toEqual([dataA, dataB]);
    }));
    it("StoreConfig behaves static over all DATABASES", () => __awaiter(void 0, void 0, void 0, function* () {
        const repoName = "data";
        const dataRepo = new IDBRepository(repoName);
        const dataA = { id: 1, name: "test A", value: 123 };
        const dataB = { id: 1, name: "test B", value: 321 };
        const dataStoreConfig = StoreConfig.getInstance().for(repoName);
        dataStoreConfig.database = "TestDbA";
        yield dataRepo.create(dataA);
        dataStoreConfig.database = "TestDbB";
        yield dataRepo.create(dataB);
        dataStoreConfig.database = "TestDbA";
        expect(yield dataRepo.getAll()).toEqual([dataA]);
        dataStoreConfig.database = "TestDbB";
        expect(yield dataRepo.getAll()).toEqual([dataB]);
    }));
});
