export interface IEntity {
    id: string | number | undefined;
}
export declare abstract class Entity implements IEntity {
    id: string | number | undefined;
}
export declare const EntityObject: {
    new (): {
        id: string | number | undefined;
    };
};
