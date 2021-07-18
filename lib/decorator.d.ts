export declare type ClassDecoratorFactory = (...args: any) => (constructor: Function) => any;
export declare type PropertyDecoratorFactory = (...args: any) => (target: any, propertyKey: string) => any;
export declare type MethodDecoratorFactory = (...args: any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
export declare type AccessorDecoratorFactory = (...args: any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
export declare type ParameterDecoratorFactory = (...args: any) => (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => any;
