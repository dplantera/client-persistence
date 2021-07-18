import { IDBClient } from "./driver/IDBClient";
import { StoreConfig } from "./driver/indexeddb.config";
import { IDBRepository } from "./repositories/IDBRepository";
import * as decorator from "./decorator";
import { Entity } from "./entities";
import { Index } from "./driver/indexeddb.decorator";
import { Store } from "./driver/indexeddb.decorator";
export { IDBClient, StoreConfig, IDBRepository, decorator, Entity, Index, Store };
