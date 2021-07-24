export interface ILogger {
    log(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    exception(message?: string, ...optionalParams: any[]): void;
    table(tabularData?: any, properties?: string[]): void;
    trace(...data: any[]): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    timeLog(label?: string, ...data: any[]): void;
    timeStamp(label?: string): void;
}
export declare let log: ILogger;
export declare function getLogger(name: string): ILogger;
export declare function setLogger(logger: ILogger): void;
