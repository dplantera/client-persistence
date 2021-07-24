import { IRead, IWrite, Newable } from "./interfaces";
import { Entity } from "../entities";
import { IDBClient } from "../driver/IDBClient";
export declare class IDBRepository<T extends Entity> implements IWrite<T>, IRead<T> {
    repository: Newable<T> | string;
    dbClient: IDBClient;
    private storeName;
    private isJavascriptContext;
    constructor(repository: Newable<T> | string, dbClient?: IDBClient);
    create(item: T): Promise<T>;
    createAll(items: T[]): Promise<T[]>;
    updateAll(items: T[]): Promise<T[]>;
    deleteAll(items?: T[]): Promise<T[]>;
    delete(id: string | number): Promise<boolean>;
    clear(): Promise<boolean>;
    update(item: T, id?: string | number): Promise<boolean>;
    getById(id: string | number | any[]): Promise<T>;
    getByIndex(index: {
        [indexName: string]: IDBValidKey | IDBKeyRange;
    }): Promise<T[]>;
    get(query: IDBValidKey | IDBKeyRange): Promise<T[]>;
    getAll(): Promise<T[]>;
    private transform;
    private getType;
}
