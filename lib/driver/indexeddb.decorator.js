/*https://saul-mirone.github.io/a-complete-guide-to-typescript-decorator/*/
import { StoreConfig } from "./indexeddb.config";
const MetaInfo = {};
function updateConfig(store, storeConfig) {
    StoreConfig.getInstance().add([
        { store, storeConfig: Object.assign({}, storeConfig) }
    ]);
}
export const Store = (args) => {
    return (constructor) => {
        var _a;
        const cfg = MetaInfo[constructor.name];
        MetaInfo[constructor.name] = Object.assign(Object.assign({}, cfg), { store: (_a = args === null || args === void 0 ? void 0 : args.name) !== null && _a !== void 0 ? _a : constructor.name, type: constructor });
        if (args === null || args === void 0 ? void 0 : args.database)
            MetaInfo[constructor.name].database = args.database;
        updateConfig(constructor.name, MetaInfo[constructor.name]);
    };
};
export const PrimaryKey = (args) => {
    return (target, propertyKey) => {
        const cfg = MetaInfo[target.constructor.name];
        const getKeyPath = () => {
            if ((cfg === null || cfg === void 0 ? void 0 : cfg.keyPath) && typeof cfg.keyPath === "string")
                return [cfg.keyPath, propertyKey];
            if ((cfg === null || cfg === void 0 ? void 0 : cfg.keyPath) && Array.isArray(cfg.keyPath))
                return [...cfg.keyPath, propertyKey];
            return propertyKey;
        };
        const keyPath = getKeyPath();
        MetaInfo[target.constructor.name] = Object.assign(Object.assign(Object.assign({}, cfg), { keyPath }), args);
        updateConfig(target.constructor.name, Object.assign(Object.assign({}, args), { keyPath }));
    };
};
export const Index = () => {
    return (target, propertyKey) => {
        const cfg = MetaInfo[target.constructor.name];
        const getIndices = () => {
            const newIndex = { name: propertyKey };
            if (cfg === null || cfg === void 0 ? void 0 : cfg.indices)
                return [...cfg.indices, newIndex];
            return [newIndex];
        };
        const indices = getIndices();
        MetaInfo[target.constructor.name] = Object.assign(Object.assign({}, cfg), { indices });
        updateConfig(target.constructor.name, { indices });
    };
};
export const getCollectedMetaInfo = () => (Object.assign({}, MetaInfo));
