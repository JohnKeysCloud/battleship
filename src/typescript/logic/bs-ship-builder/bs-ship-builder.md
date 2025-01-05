## `bs-ship.ts`

### Supplemental & Contextual Information

#### What's a `Record`?

In TypeScript, the `Record` utility type is used to create a type for an object with specific keys and corresponding values. It allows you to define a type that maps a set of keys to a specific type of value. 

* `Record<K, V>`: This is a utility type provided by TypeScript. It constructs an object type with properties of type `V` for keys of type `K`.

* When using `Record<SizeLookupKey, number | undefined>`, TypeScript expects that the `sizeLookup` object will include all possible keys defined by the `SizeLookupKey` type. `Record` ensures that the object conforms to the types shape, which means it should have all the keys that the `SizeLookupKey` type can produce. This is to ensure the prevention of runtime errors.

### `SHIP_SYMBOLS` 

This object complies with the `ShipSymbols` type, where its keys conform to the `ShipType` enumeration and the their values are symbols.

The keys of the object are defined in the form of computed properties. This enables said conformity. `[ShipType.Carrier]: Symbol('CA')` computes to `Carrier: Symbol('CA')`

The values are symbols that will represent ship positions on the gameboard by replacing its vacant symbols (i.e, `row-1: [VC, VC, VC, CA, CA, CA, CA, CA, VC, VC]`, where `VC` is the label for "vacant" symbols).

### `sizeLookup: Record<SizeLookupKey, number | undefined>`

This `sizeLookup` object was defined as a [`Record`](#whats-a-record) to ensure that all potential combinations of `ShipType` and `FleetVersion` are accounted for and explicitly handled. By using `Record<SizeLookupKey, number | undefined>`, TypeScript enforces that the `sizeLookup` object contains all possible keys derived from the `SizeLookupKey` type.

#### Key Points:

- **Complete Key Coverage**: The `Record` utility type ensures that every key represented by `SizeLookupKey` is present in the `sizeLookup` object, even if the corresponding value is `undefined`. This guarantees that all expected key combinations are accounted for, which can help prevent runtime errors related to missing keys.

- **Type Safety**: Using `Record` provides strict type checking, making sure that the `sizeLookup` object adheres to the defined shape. It helps maintain consistency and predictability in how keys and values are managed.

- **Explicit Handling**: Including all possible keys, even with `undefined` values, makes it clear which combinations are valid but currently not used, and allows for future flexibility if these keys become relevant.

### `BattleshipBuilder imlements IShipOptions` Class 

`BattleshipBuilder` implements the `IShipOptions` interface and provides the logic for how the ship instance's state changes, such as updating hits, checking if it's sunk, and any other behavior associated with the ship.

#### `public` Keyword 

In TypeScript, when you define a class that implements an interface, you typically need to explicitly declare the properties of the class before you can use them in the constructor or elsewhere.

Take, for example this **simplified**, _incorrect_ implementation:

``` typescript
class BattleshipBuilder implements IShipOptions {
  constructor(
    type: string, 
    length: number, 
    seaworthy: boolean,
    hitCounter: number 
    ) {
    thislength = length;
    this.seaworthy = seaworthy;
    this.hitCounter = hitCounter;
  }
}
```

This code is _attempting_ to assign values to `thislength`, `this.hitCounter`, and `this.seaworthy`, but these properties haven't been declared in the class. TypeScript expects you to **explicitly** declare these properties within the class before using them.

Here is one fix:

``` typescript
class BattleshipBuilder implements IShipOptions {
  type: string, 
  length: number;
  seaworthy: boolean;
  hitCounter: number;

  constructor(
    type: string, 
    length: number, 
    seaworthy: boolean,
    hitCounter: number
    ) {
    thislength = length;
    this.seaworthy = seaworthy;
    this.hitCounter = hitCounter;
  }
}
```

Now, the properties are properly declared and they can be used and assigned values within the constructor. 

While this implementation is correct, there is a more precise way to achieve the same result in TypeScript by using the `public` keyword in the constructor parameters. 

When you prefix constructor parameters with `public` (or `private` or `protected`), TypeScript automatically creates corresponding class properties and initializes them with the values passed to the constructor.

This eliminates the need to manually declare the properties at the top of the class and then assign them in the constructor. 

Using the `public`, `private`, or `protected` prefixes in constructor parameters is considered best practice in TypeScript when you want to quickly declare and initialize class properties, as it makes the code more efficient and concise.

Here is the refactored version:

``` typescript
class BattleshipBuilder implements IShipOptions {
  constructor(
    public type: string,
    public length: number,
    public seaworthy: boolean = true;
    public hitCounter: number,
  ) {
    // Out of scope
  }
  // Also out of scope 
}
```

**However**, the parameters of a constructor should only include what's completely necessary for creating an instance of the class. In this particular scenario, `length`, `seaworthy` and `hitCounter` are set dynamically by using the ship `type` and `version`; Hence, these are the two properties required in the parameters.

#### The Constructor Body

Inside the curly braces `{}` of a class constructor, you generally find the logic that initializes the class, sets up initial state, or performs any other operations that are necessary when creating an instance of the class. 

Such operations include:
  * **Initializing properties:** Setting up properties that might depend on some initial logic or calculations.
  * **Validation:** Checking if the arguments passed to the constructor meet certain criteria.
  * **Event Listeners:** Setting up necessary event listeners or other callbacks.
  * **Method calls:** Triggering certain methods to initialize state or set up necessary data.

In the `BattleshipBuilder` constructor, the symbol that represents the ship instance is set as a property on a newly created instance (more on why [here](#ship_symbols)).

I also initialized `key` as a template literal string that conforms to the `SizeLookupKey` type. This `key` is dynamically constructed using the `ShipType` and `FleetVersion` arguments passed to the constructor, ensuring it matches the expected format (e.g., `'battleship-1990'`).

In addition, I created a `length` variable that utilizes the constructed `key` to look up the corresponding ship length in the `sizeLookup` `Record`. If the `length` retrieved from the lookup is `undefined`, indicating that the combination of `ShipType` and `FleetVersion` is invalid or unsupported, an error is thrown to signal the issue. Otherwise, the `length` property of the instance is assigned the retrieved value, ensuring the ship's length is correctly set based on its type and version.

#### Instance Methods

##### `hit` & `isSeaworthy`

* **`hit`**: First a check is performed that determines whether or not the ship is seaworthy and returns a message stating this if that is the case, otherwise, the instances hit counter is incremented.

* **`isSeaworthy`**: This check determines if the ship has exceeded its hit capacity.

* **`get hitCounter`**: Retrieves the hit counter for the ship instance.