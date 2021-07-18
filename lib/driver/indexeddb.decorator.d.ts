declare type ClassDecoratorFactory = (...args: any) => (constructor: Function) => any;
declare type PropertyDecoratorFactory = (...args: any) => (target: any, propertyKey: string) => any;
interface IStoreDecorator extends ClassDecoratorFactory {
    (args: {
        name?: string;
        database?: string;
    }): (constructor: Function) => any;
}
interface IPrimaryKey extends PropertyDecoratorFactory {
    (args: {
        autoIncrement: boolean;
    }): (target: any, propertyKey: string) => any;
}
interface IIndex extends PropertyDecoratorFactory {
    (): (target: any, propertyKey: string) => any;
}
export declare const Store: IStoreDecorator;
export declare const PrimaryKey: IPrimaryKey;
export declare const Index: IIndex;
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
export {};
