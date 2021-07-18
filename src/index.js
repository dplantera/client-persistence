import {IDBClient} from "./driver/IDBClient";
import {StoreConfig} from "./driver/indexeddb.config";
import {IDBRepository} from "./repositories/IDBRepository";
import {Entity} from "./entities";
import {Index, Store} from "./driver/indexeddb.decorator";

import * as decorator from "./decorator"

export {
    IDBClient, StoreConfig, IDBRepository, decorator, Entity, Index, Store
}