## `bs-ship.ts`

### Supplemental & Contextual Information

#### What's `enum`?

In TypeScript, an `enum` (short for "enumeration") is a way to define a set of named constants. Enumeration allow you to define a collection of related values that can be represented by names, making your code more readable and easier to manage. 

#### `enum` vs `type`

**Purpose:**
  * `enum`: Represents a fixed set of named constants.
  * `type`: Represents a flexible shape of data or a set of possible values.

**Definition:**
  * `enum`: Defined using the `enum` keyword.
  * `type`: Defined using the `type` keyword.

**Value Type:** 
  * `enum`: Can represent numbers or strings, with explicit or implicit values assigned to each member.
  * `type`: Can represent unions, intersections, primitives, objects and more. 

**Composability:**
  * `enum`: Not composable; `enum`'s cannot be combined or extended once defined.
  * `type`: Highly composable; types can be combined using **unions**, **intersections**, and **mapped types**.

**Readability:**
  * `enum`: Provides readable, named constants that improve code clarity when referencing specific values.
  * `type`: Provides more flexibility in shaping and describing data, enhancing readability for complex structures.

**Type Safety:**
  * `enum`: Enforces strict constraints with a fixed set of named values.
  * `type`: Can enforce strict constraints with union types, and also allow more nuanced flexibility in type design.

**Use Case:**
  * `enum`:  Best for well-defined, unchanging sets of values, like days of the week or user roles.
  * `type` Best for defining flexible and complex data structures that need to combine or extend other types.

**Runtime Behavior:**
  * `enum`: `enum`'s exist at runtime, meaning they are preserved in the emitted JavaScript.
  * `type`: Types are purely a compile-time construct and do not exist in the emitted JavaScript.

**Declaration Merging:**
  * `enum`: `enum`'s do not support merging they remain fixed as declared.
  * `type`: Types can be combined and extended with `&` (intersection), `|` (union), and mapped types.

**Auto-Completion:** 
  * `enum`: Provides automatic auto-completion for `enum` members in supported editors. 
  * `type`: Provides auto-completion when using union types but not for all types.

**Default Values:**
  * `enum`: `enum`'s can have default values (e.g., incrementing numbers or explicit strings).
  * `type`: Types do not have "default values" in the same sense; they define the structure of possible values.





##### Types of `emum`'s

1. **Numeric Enumerations:** Numeric enumerations are the most common type. By default, the first value is `0`, and subsequent values increment by `1`. You can also explicitly set values for any `enum` member.

``` typescript
enum Direction {
  Up,        // 0
  Down,      // 1
  Left,      // 2
  Right      // 3
}

console.log(Direction.Up);    // Output: 0
console.log(Direction.Right); // Output: 3
```

You can also manually set the values:

``` typescript
enum Direction {
  Up = 1,
  Down = 2,
  Left = 4,
  Right = 8
}

console.log(Direction.Up);    // Output: 1
console.log(Direction.Right); // Output: 8
```

2. **String Enumeration:** String enumeration members have a `string` value. They don't auto-increment, so you must explicitly assign a value to each member.

``` typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

console.log(Direction.Up);    // Output: 'UP'
console.log(Direction.Right); // Output: 'RIGHT'
```

3. **Heterogeneous Enumeration:** TypeScript also allows `enum`'s to mix numeric and string values, though this is less common and generally _not_ recommended. 

``` typescript
enum MixedEnum {
  No = 0,
  Yes = 'YES'
}

console.log(MixedEnum.No);  // Output: 0
console.log(MixedEnum.Yes); // Output: 'YES'
```

##### Features of `enum`'s
* **Reversibility:** Numeric `enum`'s have a reverse mapping feature, meaning you can get the name of an `enum` member from its value.

``` typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

console.log(Direction[1]); // Output: 'Up'
```

* **Initialization:** `enum`s can be initialized with constants, expressions, or any other constant values.

* **Default Behavior:** If no value is provided, the `enum` members are auto-incremented numeric values starting from `0`.

##### Usage
`enum`'s are useful when you have a set of related constants that are best represented by descriptive names rather than numbers or strings. They enhance code readability and maintainability by providing meaningful names to constant values. 

Here's a practical example of using `enum`s in a TypeScript application:

``` typescript
enum Status {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

function getStatusMessage(status: Status): string {
  switch (status) {
    case Status.Pending:
      return 'The task is pending.';
    case Status.InProgress:
      return 'The task is currently in progress.';
    case Status.Completed:
      return 'The task has been completed.';
  }
}

console.log(getStatusMessage(Status.InProgress)); // Output: 'The task is currently in progress.'
```

#### Benefits of an Interface

1. **Clear Contract for Implementations:** The interface defines a clear contract that any implementing class must adhere to. This ensures consistency across different implementations. For example, if you were to create another class that implements `IShipOptions`, you are guaranteed that it will have the properties `size`, `hitCounter` and `seaworthy`.

2. **Type Safety:** TypeScripts interfaces provide type safety by ensuring that the properties and methods in your class adhere to the specified types. This prevents errors like assigning an incorrect type to a property.

3. **Reusability:** The `IShipOptions` interface can be reused in other parts of your code. For instance, if you have a function that operates on objects with these properties, you can type the function to accept `IShipOptions`, making your code more modular and flexible.

For example:

``` typescript
function printShipStatus(ship: IShipOptions): void {
  console.log(`Ship Type: ${ship.type}`);
  console.log(`Ship Size: ${ship.size}`);
  console.log(`Is Seaworthy: ${ship.seaworthy}`);
  console.log(
    ship.hitCounter !== undefined 
    ? `Hit Counter: ${ship.hitCounter}` 
    : 'Hit Counter: n/a'
  );
}
```

Had I passed the `ship` object without specifying the type in the function signature, there would be:

  * **No Type Checking:** Without the type annotation `ship: IShipOptions`, TypeScript won't check if the object being passed has the expected properties. This could lead to runtime errors if the object doesn't match the expected shape.

  * **Less Clarity:** The lack of an explicit type makes it harder to know what the function expects. This can lead to confusion, especially in a larger codebase.

4. **Ease of Refactoring:** If we ever need to change the properties or types associated with ships, we can do so in the interface, and TypeScript will flag any part of our code that does not conform to the new structure. This makes refactoring easier and safer.

5. **Documentation and Intellisense:** Using interfaces provides automatic documentation and better IntelliSense in code editors like VS Code. This helps us as developers understand what properties and types are expected when working with the `BattleshipFactory` class or any other class that implements `IShipOptions`.

6. **Separation of Concerns:** By separating the structure (`IShipOptions`) from the behavior (methods of `BattleshipFactory` instances), we maintain a clear distinction between what a ship "is" and what a ship "does." This separation can lead to cleaner and more maintainable code. 

7. **Default Values in Constructor:** In our `BattleshipFactory` class, we have default values for `hitCounter` and `seaworthy` in the constructor. This simplifies object creation, as we don't need to specify all values when creating an instance. The interface helps ensure that even with default values, the structure remains consistent.

8. **Error Handling in Constructor:** The interface ensures that any class implementing it will respect the required types and properties. The constructor logic in `BattleshipFactory`, like throwing an error if `size <= 0`, provides additional safeguards during object instantiation, ensuring no invalid ship objects are created. 

#### What's a `Record`?

In TypeScript, the `Record` utility type is used to create a type for an object with specific keys and corresponding values. It allows you to define a type that maps a set of keys to a specific type of value. 

* `Record<K, V>`: This is a utility type provided by TypeScript. It constructs an object type with properties of type `V` for keys of type `K`.

* When using `Record<SizeLookupKey, number | undefined>`, TypeScript expects that the `sizeLookup` object will include all possible keys defined by the `SizeLookupKey` type. `Record` ensures that the object conforms to the types shape, which means it should have all the keys that the `SizeLookupKey` type can produce. This is to ensure the prevention of runtime errors.

### `ShipType` Enumeration

As of 9/4/24, the Battleship board game features a variety of ship types, each with specific attributes and roles. To create a system that can effectively manage and distinguish between these ship types in the web implementation, I defined an `enum` called `ShipType`. This `enum` includes the various ship types as its members, such as `Carrier`, `Battleship`, `Cruiser`, `Destroyer`, `Submarine`, and `PatrolBoat`.

By using the `ShipType` `enum`, the code enforces type safety by ensuring that any value assigned to a variable of this type must correspond to one of the specified ship types. This approach provides a clear and structured way to handle different ship types, improving code readability and reducing the risk of errors by limiting the values to a defined set of constants.

### `Version` Enumeration

As of 9/4/24, there are two official versions of the Battleship board game, represented by the years 1990 and 2002. To create a flexible system that can distinguish between these versions in the web implementation, I defined an `type` called `Version`. This `type` includes these years as its members, and it is used to enforce type safety by ensuring that any value assigned to a variable of this type must match one of the specified years. This approach provides a strict type constraint that aligns with the official versions of the game, enhancing code clarity and reliability.

### `SizeLookupKey` Type

The type `SizeLookupKey` is defined as `${ShipType}-${Version}`. This type ensures that the keys used in the `sizeLookup` table adhere to a specific format. By using this template literal type, TypeScript enforces that keys in the `sizeLookup` table must combine a valid `ShipType` with a valid Version, separated by a hyphen. This helps maintain consistency and type safety, making sure that only properly formatted keys are used throughout the code.

### `IShipOptions` Interface

`IShipOptions` is an `interface` that defines the structure of a `Ship` object including its properties and methods related to its state. 

The question mark (`?`) appended to `hitCounter` and `version` is used to indicate that the property is optional. 

In TypeScript, when a property is marked as optional, it means that classes or objects implementing the interface where the property exists may include the property, but it is not _required_ to do so.

### `sizeLookup: Record<SizeLookupKey, number | undefined>`

This `sizeLookup` object was defined as a `Record` to ensure that all potential combinations of `ShipType` and `Version` are accounted for and explicitly handled. By using `Record<SizeLookupKey, number | undefined>`, TypeScript enforces that the `sizeLookup` object contains all possible keys derived from the `SizeLookupKey` type, which combines `ShipType` and `Version`. 

#### Key Points:

- **Complete Key Coverage**: The `Record` utility type ensures that every key represented by `SizeLookupKey` is present in the `sizeLookup` object, even if the corresponding value is `undefined`. This guarantees that all expected key combinations are accounted for, which can help prevent runtime errors related to missing keys.

- **Type Safety**: Using `Record` provides strict type checking, making sure that the `sizeLookup` object adheres to the defined shape. It helps maintain consistency and predictability in how keys and values are managed.

- **Explicit Handling**: Including all possible keys, even with `undefined` values, makes it clear which combinations are valid but currently not used, and allows for future flexibility if these keys become relevant.

### `BattleshipFactory` Class
`BattleshipFactory` implements the `IShipOptions` interface and provides the actual logic for how the ship’s state changes, such as updating hits, checking if it's sunk, and any other behavior associated with the ship.

#### `public` Keyword 

In TypeScript, when you define a class that implements an interface, you typically need to explicitly declare the properties of the class before you can use them in the constructor or elsewhere.

Take, for example this **simplified**, _incorrect_ implementation:

``` typescript
class BattleshipFactory implements IShipOptions {
  constructor(
    type: string, 
    size: number, 
    seaworthy: boolean,
    hitCounter: number 
    ) {
    this.size = size;
    this.seaworthy = seaworthy;
    this.hitCounter = hitCounter;
  }
}
```

This code is _attempting_ to assign values to `this.size`, `this.hitCounter`, and `this.seaworthy`, but these properties haven't been declared in the class. TypeScript expects you to **explicitly** declare these properties within the class before using them.

Here is one fix:

``` typescript
class BattleshipFactory implements IShipOptions {
  type: string, 
  size: number;
  seaworthy: boolean;
  hitCounter: number;

  constructor(
    type: string, 
    size: number, 
    seaworthy: boolean,
    hitCounter: number
    ) {
    this.size = size;
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
class BattleshipFactory implements IShipOptions {
  constructor(
    public type: string,
    public size: number,
    public seaworthy: boolean = true;
    public hitCounter: number,
  ) {
    // Out of scope
  }
  // Also out of scope 
}
```

#### The Constructor Body

Inside the curly braces `{}` of a class constructor, you generally find the logic that initializes the class, sets up initial state, or performs any other operations that are necessary when creating an instance of the class. 

Such operations include:
  * **Initializing properties:** Setting up properties that might depend on some initial logic or calculations.
  * **Validation:** Checking if the arguments passed to the constructor meet certain criteria.
  * **Event Listeners:** Setting up necessary event listeners or other callbacks.
  * **Method calls:** Triggering certain methods to initialize state or set up necessary data.

In the `BattleshipFactory` constructor, I initialized the `key` variable as a template literal string that conforms to the `SizeLookupKey` type. This `key` is dynamically constructed using the `ShipType` and `Version` arguments passed to the constructor, ensuring it matches the expected format (e.g., `'battleship-1990'`).

Subsequently, I created a `size` variable that utilizes the constructed `key` to look up the corresponding ship size in the `sizeLookup` `Record`. If the `size` retrieved from the lookup is `undefined`, indicating that the combination of `ShipType` and `Version` is invalid or unsupported, an error is thrown to signal the issue. Otherwise, the `size` property of the instance is assigned the retrieved value, ensuring the ship's size is correctly set based on its type and version.

#### Instance Methods

##### `hit` & `isSeaworthy`

* **`isSeaworthy` Check:** This check determines if the ship has exceeded its hit capacity.

* **`hitCounter` Increment:** Only increments if the ship is still seaworthy.

* **Messages:** Different messages are returned based on the ships status.
