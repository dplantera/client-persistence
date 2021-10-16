[IndexedDB]:https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
# Client-Persistence
A simple developer friendly API to interact with [IndexedDB] out of javascript, typescript or react based projects.

This started as a personal project to become familiar with client-side persistence in web development. 
However, because I find more and more value in using it for my other projects I will extend and maintain it further.

### Why?
- Using IndexedDb in Javascript without worrying about store configuration
- Yet, for more complex use cases a more developer friendly approach to configure IndexedDB  
- Compatibility with various paradigms: vanillaJs, classes, constructor functions, typescript

## Getting Started
- Install `client-persistence`:
  - with npm
    ```bash
    npm install --save github:dplantera/client-persistence#main
    ```
  - or put it in your package.json  
    ```json
    {
      "client-persistence": "github:dplantera/client-persistence#main"
    }
    ```
## Examples
Please consult the tests files for more detailed examples.

### Persist and Retrieve data with `IDBrepository` 

- **The Fast Way**: usage in `vanilla javascript` 
  - create and retrieve data with `IDBrepository` asynchronously
  ````javascript
   import { IDBRepository } from "client-persistence";

   const repositoryName = "Data";
   const dataStore = new IDBRepository(repositoryName);
   
   const someDataToSave = {name: "test", value: 123};
   const savedData = await dataStore.create(someDataToSave);
   console.log(savedData)
   // {name: "test", value: 123, id: 1}
   
   console.log(await dataStore.getById(someDataToSave.id))
   // {id: 1, name: "test", value: 123}
   console.log(await dataStore.getAll())
   // [ {id: 1, name: "test", value: 123} ]
  ````  


- **The Save Way**: usage in `typescript`
  ````typescript
  import { IDBRepository, Entity } from "client-persistence";

  type Data = { name: string, value: number } & Entity;
  const data: Data = {id: undefined, value: 1, name: "test"};
  
  const dataStore = new IDBRepository<Data>("data");
  
  const savedData = await storeData.create(data)
  console.log(savedData)
  // {id: 1, name: "test", value: 123}
  
  console.log(await dataStore.getById(data.id))
  // {id: 1, "test", value: 123}
  ````  

- **The Decorative Way**: usage in `typescript` with `classes` and `decorators`
  ````typescript
  import { IDBRepository, IEntity } from "client-persistence";

  @Store({database: "OptionalTargetDatabaseName", name: "OptionalDataStoreName"})
  class DataDecoratedWithConfig implements IEntity {
      @PrimaryKey({autoIncrement: false}) 
      id: number | undefined
      @PrimaryKey() 
      compositeId: string | undefined
      @Index() 
      attrStr: string;

      constructor(public attrNum: number, attrStr: string) {
          this.attrStr = attrStr;
      }
  }
  
  const data = new DataDecoratedWithConfig(1, "test2");
  const dataStore = new IDBRepository(DataDecoratedWithConfig);
  
  console.log(await dataStore.create(data))
  // DataDecoratedWithConfig { attrNum: 11, attrStr: 'test2', id: 123, compositeId: 'some-id-part'}
  
  console.log(await dataStore.getById([123, "some-id-part"]))
  // DataDecoratedWithConfig { attrNum: 1, attrStr: 'test2', id: 123, compositeId: 'some-id-part' }
  
  console.log(await dataStore.getByIndex({attrStr: "test2"}))
  // [ DataDecoratedWithConfig { attrNum: 1, attrStr: 'test2', id: 123, compositeId: 'some-id-part' } ]

  ````
