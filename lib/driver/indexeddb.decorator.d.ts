import { ClassDecoratorFactory, PropertyDecoratorFactory } from "../decorator";
export declare const Store: ClassDecoratorFactory;
export declare const PrimaryKey: PropertyDecoratorFactory;
export declare const Index: PropertyDecoratorFactory;
export declare const getCollectedMetaInfo: () => {
    [x: string]: {
        store: string;
        database?: string | undefined;
    } & IDBObjectStoreParameters & {
        database: string;
        name?: string | undefined;
        indices?: import("./indexeddb.config").TStoreIndex[] | undefined;
    } & {
        type: Function;
    };
};
