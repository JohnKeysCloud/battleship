## `bs-fleet-factory.ts`

### Supplemental Contextual Information

#### `import type`

Using `import type` ensures that only type information is imported, which helps eliminate unused imports in the output code. It also prevents the import from being included in the compiled JavaScript, keeping the output cleaner and more efficient.

#### `type` vs. `interface`

In TypeScript, both `interface` and `type` can be used to define the shape of objects, but they have some differences in capabilities and use cases.  

Building on the benefits of interfaces (See: [Benefits of an Interface](../bs-ship-factory/bs-ship-factory.md#benefits-of-an-interface)), here is a comparison between between them and TypeScripts, `type`. 

##### `interface`

1. **Purpose:** Primarily used to define the structure of objects, including their properties and methods.

2. **Declaration:** Interfaces can be extended and implemented using the `extends` and `implements` keywords, respectively. For example:
****
``` typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
}

class Manager implements Employee {
  name: string;
  age: number;
  employeeId: number;
  constructor(name: string, age: number, employeeId: number) {
    this.name = name;
    this.age = age;
    this.employeeId = employeeId;
  }
}
```

3. **Merging:** Interfaces can be merged using multiple declarations. TypeScript will automatically merge them. For example:

``` typescript
interface Person {
  name: string;
}

interface Person {
  age: number;
}

// Merged interface
const person: Person = { name: 'Alice', age: 30 };
```

4. **Declaration Merging:** Useful when working with libraries of adding properties to existing types.

##### `type`

1. **Purpose:** Used to define types that can be primitive, union, intersection, tuple, or any other type.

2. **Declarations:** Types can represent more complex type constructs like unions, intersections and mapped types. For example:

``` typescript
type Person = {
  name: string;
  age: number;
};

type Employee = Person & {
  employeeId: number;
};

const manager: Employee = {
  name: 'Alice',
  age: 30,
  employeeId: 123
};
```

3. **Union and Intersection Types:** Types can be combined using union (`|`) and intersection (`&`) operators. For example:

``` typescript
type Animal = { species: string };
const tiger: Animal = { species: 'Tiger' };

// Dog has `species` & `breed`
type Dog = Animal & { breed: string };
const labrador: Dog = {
  species: 'Dog',
  breed: 'Labrador'
};

// Pet has either Dog properties, or is an object with a name property 
type Pet = Dog | { name: string };
const petDog: Pet = {
  species: 'Dog',
  breed: 'Golden Retriever'
};
const petCat: Pet = {
  name: 'Whiskers'
};
```

4. **No Declaration Merging:** Types do not support merging. If you need to extend or modify a type, you must use a new type and combine them using intersections.

##### Summary of Key Differences

1. **Extending and Implementing:**
  * **Interface:** Can be extended and implemented directly.
  * **Type:** Uses intersections to extend types.

2. **Declaration Merging:**
  * **Interface:** Supports declaration merging.
  * **Type:** Does not support declaration merging.

3. **Complex Types:**
  * **Interface:** Primarily for object shapes and method signatures.
  * **Type:** More versatile, can represent complex types including unions, intersections, and tuples.

4. **Use Cases:**
  * **Interface:** Ideal for defining object shapes, especially when working with class implementations. 
  * **Type:** ideal for more complex type definitions and combinations.

Both `interface` and `type` are powerful tools in TypeScript, and choosing between them often comes down to the specific needs of your application and the complexity of the type definitions.

#### What is a **Mapped Type**?

A **mapped type** in TypeScript allows you to create a new `type` by transforming properties of an existing `type`. It uses a syntax that iterates over the keys of a type or union of string literals to create a new type where each key is transformed or mapped to a different type.

##### Syntax and Basic Usage

``` typescript
type NewType = {
  [Key in OldKeyType]: NewTypeValue;
};
```

* `Key`: represents each key in the old type (`OldKeyType`).
* `OldKeyType`: The type or union of string literals that defines the possible keys.
* `NewTypeValue`: The type for the values of these keys in the new type.

##### Examples

**Basic Mapped Type**

``` typescript
type Animal = {
  species: string;
};

type Dog = Animal & {
  breed: string;
};

type Pet = Dog | { name: string };
```

As a refresher, `Pet` here is a _union_ type that can either be a `Dog` or an object with a `name` property.


**Mapped Type Example**

``` typescript
type Fleet = {
  [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipFactory;
};
```

* `[key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']`: This part iterates over each key in the union of string literals.

* `?: BattleshipFactory`: The type for each value associated with these keys is `BattleshipFactory`. The `?` indicates that each property is optional. 

In this case, `Fleet` is a type where each key (one of the strings in the union) is an optional property with a value of type `BattleshipFactory`.

`Fleet` only allows the properties specified in the union of string literals. Any property with a key not included in this list will result in a TypeScript error if you try to add it. 

**Advanced Usage**

Mapped Types can also include additional transformations and modifiers. For instance:

* **Read-only Mapped Type:** Makes all properties of a type read-only. This keyword makes the properties of any of your `type` immutable. This means that once the `type` object is created, the values of its properties cannot be reassigned or modified.

``` typescript
type ReadonlyFleet = {
  readonly [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipFactory;
};

const myFleet: ReadonlyFleet = {
  carrier: new BattleshipFactory(),
  battleship: new BattleshipFactory(),
};

// Attempting to reassign a fleet property will cause a TypeScript error
myFleet.carrier = new BattleshipFactory(); // Error: Cannot assign to 'carrier' because it is a read-only property.
```
Note that the `readonly` keyword only makes the existing properties of `myFleet` immutable; it does not prevent adding new properties to the object, provided that the new properties match the shape defined by the type. 

* **Partial Mapped Type:** Makes all properties optional.

### `type Fleet` (Mapped Type)

#### Explanation

1. `type Fleet`:
  - Defines a new `type` named `Fleet`.

2. Mapped Type:

``` typescript

// Explicit String Union
type Fleet = { [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipFactory; }

// Which is the same as:
// (Explicit Property Definition)
type Fleet = {
  carrier?: BattleshipFactory, 
  battleship?: BattleshipFactory, 
  destroyer?: BattleshipFactory, 
  submarine?: BattleshipFactory, 
  cruiser?: BattleshipFactory, 
  patrolBoat?: BattleshipFactory, 
}

// Which is also the same as:
// (`enum`-based definition)
type Fleet = {
  [key in ShipType]?: BattleshipFactory;
};

```

This syntax uses a mapped type to create an object type with specific keys and value types.

* `[key in ...]`: 
  - `key` is a placeholder and can be replaced with any valid identifier such as `K`, `T`, `ShipType`, or anything else that makes sense in your context. 

* The keys of the `Fleet` object must be one of the specified strings.

* The `?` after each key means that the property is optional. This means you could have a `Fleet` object without some of these properties.

* The value for each key must be of type `BattleshipFactory`.

---

**✨ Side Note:**

Using the intersection operator (`&`) would result in an empty type because its impossible for a string to simultaneously be multiple unique strings. In other words, there is no **single string** that satisfies being both '`carrier`' and '`battleship`':

``` typescript
type Carrier = 'carrier';
type Battleship = 'battleship';

type CarrierAndBattleship = 'carrier' & 'battleship';
```

The **intersection logic** for `CarrierAndBattleship` _is_ valid. To conform to the type, a variable would need to be assigned to a string that is both '`carrier`' and '`battleship`' at the same time.

Though the logic is valid, the condition is **impossible**. A string cannot simultaneously be another. 

This results in an **empty type**- a type that doesn't have any possible values.

---

#### First Refactored Version

``` typescript
const shipTypes = [
  'carrier',
  'battleship',
  'destroyer',
  'submarine',
  'cruiser',
  'patrolBoat',
] as const;

type ShipType = (typeof shipTypes)[number];

// Define the type for a fleet with optional properties
type Fleet = {
  [key in ShipType]?: BattleshipFactory;
};
```

* `shipTypes` here is an array of strings with a `const` assertion. The `as const` tells TypeScript to treat the elements of the array as literal types, not generic strings. 

  * **Without `as const`:** TypeScript infers the type of `shipTypes` as `string[]`. It knows `shipTypes` is an array of strings, but it doesn't know the literal values '`carrier`', '`battleship`', '`destroyer`'.
  
  The issue with not using `as const` is that if you want to create a type based on the values in your array (e.g., a union type), you can't do it directly because TypeScript just sees `string[]`.

  * **With `as const`:**
    1. **Elements Treated as Literal Types:**
      - Instead of treating the array elements as generic `string` types, TypeScript treats each element as a specific, literal string type.
      - The type of `shipTypes` becomes `readonly ['carrier', 'battleship', 'destroyer']`, meaning the array has exactly three elements with those exact values.
    2. **Make the Array Read-Only:**
      - The array is now `readonly`, meaning you cannot change its contents. 

This leads us to:

``` typescript
type ShipType = typeof shipTypes[number];
```

If `shipTypes`, the array used to determine the values of `ShipType` above, contains the strings `'carrier'`, `'battleship'` and `'destroyer'`, the above is the same as:

``` typescript
type ShipType = 'carrier' | 'battleship' | 'destroyer';
```

Meaning that, `ShipType` only accepts **one** of these three specific strings, not just as any string. To conform, a variable must hold **one** of the specified strings.

`typeof` gives us the `type` of the `shipTypes` array. Since `shipTypes` is an array with `as const`, TypeScript treats it as a tuple with specific string literals as its elements.

---

**✨ Side Note: Tuples**

A **tuple** in TypeScript is essentially an array with a fixed number of elements, where each element can have a different type. The indices of the tuple (starting from 0) act as the "keys" to access each element.

For example:

``` typescript
// Define a tuple with three elements: a string, a number, and a boolean
let myTuple: [string, number, boolean];

// Assigning values to the tuple
myTuple = ['TypeScript', 2024, true];

// Accessing tuple elements by index
let language: string = myTuple[0]; // 'TypeScript'
let year: number = myTuple[1];      // 2024
let isAwesome: boolean = myTuple[2]; // true
```

---

Therefore, if you define a tuple and then try to create a mapped type from it:

``` typescript
const myTuple = ['TypeScript', 2024, true] as const;

type TupleElementTypes = typeof myTuple[number];
// TupleElementTypes = 'TypeScript' | 2024 | true
```

We create a union type of all possible types in the tuple.

In TypeScript, when you use `number` as an index for an array or tuple type, it represents any valid index of that array or tuple. The `number` index allows you to access the types of elements stored in that array or tuple.

`typeof myTuple[number]` gives you the type of the elements in the tuple. Since the tuple has different types for different indices, `number` will give you a union of all the possible types of the elements: 'hello' | 42 | true. This is enabled by the assignment to a `type` in TypeScript.

Instead of number, you could use a specific index to get the type of _one_ of the arrays values. 

To reiterate, if `as const` is not used in the declaration of an array of strings for example. `typeof` would yield `String[]` rather than, with `as const`, create a union of the specific strings that compose the array.

💭 An array declared with multiple different types _without_ `as const` when retrieving the arrays type in TypeScript would yield a union of the value types. With `as const`, the union would consist of the actual _values_, not their types.

Therefore:

``` typescript
type ShipType = (typeof shipTypes)[number];
```

… returns `readonly ['carrier', 'battleship', 'destroyer', 'submarine', 'cruiser', 'patrolBoat']` (because `shipTypes` is declared with `as const`).

``` typescript
// Define the type for a fleet with optional properties
type Fleet = {
  // Mapped Type
  [key in ShipType]?: BattleshipFactory;
};
```

Creates a `type` where the keys of conforming objects must be in `ShipType`. The question mark here means the same as it did in the previous version of this `type` setup. The keys are all optional. Meaning that an object still conforms to the `Fleet` `type` if only some of they keys are present (so long as the keys _values_ conform to the `BattleshipFactory` class).

If the array were to be declared without `as const`, TypeScript would not treat its elements as literal types but instead infers broader, more general types for each element based on its value. Here’s what happens in that case:

``` typescript
// Array without 'as const', so TypeScript infers broader types
const mixedArray = [42, 'battleship', true, { name: 'carrier' }];

// Using 'typeof' and index access to create a type
type MixedType = (typeof mixedArray)[number];

// This will result in the type: number | string | boolean | { name: string }
let myValue: MixedType;

myValue = 42; // valid
myValue = 'battleship'; // valid
myValue = true; // valid
myValue = { name: 'carrier' }; // valid
myValue = 'destroyer'; // valid, since 'destroyer' is a string
myValue = 100; // valid, since 100 is a number
myValue = { name: 'submarine' }; // valid, since it matches { name: string }
```

**Key Differences**
  * With `as const`: Types are exact literals or specific object structures.
  * Without `as const`: Types are generalized, allowing broader ranges of values, reducing type specificity and strictness.


#### Current Refactored Version

Instead of duplicating a type definition for ship types in the fleet factory module, I refactored `bs-ship-factory.ts` to include an enumeration (`enum`) of the ship types. This change allows us to import the `ShipType` `enum` directly into the fleet factory module, maintaining type safety and other benefits. Additionally, this approach adheres to the DRY (Don't Repeat Yourself) principle by avoiding redundant type definitions. 

> Teaching while learning! 💭

### `type ShipConfig` and `type ShipConfigs`

These `type` declarations are used to simplify the parameter definition of the `createFleet` static method, which is responsible for creating fleets and ensuring proper class instantiation.

- **`ShipConfigs`** defines the shape of the `shipConfigs` object that the method accepts. It ensures that the object has keys that conform to `ShipType` and that the corresponding values conform to the `ShipConfig` type.

- **`ShipConfig`** specifies that the object should have a `type` key whose value conforms to `ShipType` and an optional `version` key whose value conforms to `Version`.

By using these types, the static method can enforce type safety and clear structure in the passed configurations, making the code more readable and maintainable.

### `class BattleshipFleetFactory`

#### `private fleet: Fleet`

A private property in the class that conforms to the `Fleet` type, which, as previously discussed, is an object where the keys are specific ship types (e.g., 'carrier', 'battleship') and the values are instances of the `BattleshipFactory` class.

##### Why is the property not in the constructor?

The `fleet` property is not directly assigned in the constructor because it is created dynamically based on the parameters passed to the constructor. This dynamic creation means the property does not need to be explicitly included as a parameter in the constructor.

##### Why is it `private`?

The `fleet` property is marked as `private` to encapsulate and protect the internal state of the `BattleshipFleetFactory` class. Making `fleet` private ensures that it can only be accessed or modified from within the class, preventing external code from directly altering the fleet's data. This design pattern helps maintain the integrity of the fleet by controlling access through specific methods like `getShip` or via a `get` accessor.

#### `private constructor(fleet: Fleet)` Constructor

The `private` keyword in the constructor of a class means that instances of the class cannot be created directly from outside the class using the `new` keyword. Instead, the class must provide static methods or properties to control how instances are created.

**Why Use a Private Constructor?**

1. **Controlled Instantiation**:
   - By making the constructor private, the class ensures that it cannot be instantiated directly by users of the class. This allows for strict control over how instances are created.

2. **Design Pattern Implementation**:
   - This design is useful for implementing certain design patterns, such as the Factory pattern. In the case of the `BattleshipFleetFactory`, only predefined static methods (`createHasbroFleet` and `createMBFleet`) are used to create instances. These methods enforce specific rules or configurations for fleet creation.

3. **Encapsulation**:
   - The private constructor encapsulates the instantiation logic and state management within the class. It prevents the creation of instances with invalid or inconsistent state, ensuring that all instances adhere to the expected configuration.

4. **Abstraction of Fleet Creation**:
   - For the Battleship game, where there are predefined fleet compositions, the private constructor abstracts the complexity of fleet creation. Users interact with the class through static methods, which handle the instantiation details and ensure that only valid fleets are created according to the game’s rules.

In summary, the private constructor in `BattleshipFleetFactory` is used to enforce controlled and consistent instantiation through static methods, aligning with the specific requirements of the Battleship game.

#### `private static createFleet` Method

##### Why it private?

Since it is a utility function that helps to generate a `Fleet` based on provided configurations. Since it's a helper method that doesn't depend on the instances state, it does not need access to instance-specific data. Making it static allows it to be called without needing to create an instance. 

##### `createFleet` Parameter Explained

``` typescript
// Initial Paramater (Pre-refactor)
shipConfigs: { [key in ShipType]?: { type: ShipType; version?: Version } }

// Refactored with `type` creation
type ShipConfig = {
  type: ShipType;
  version?: Version;
};

type ShipConfigs = {
  [key in ShipType]?: ShipConfig;
};

// New Parameter (Post-refactor)
shipConfiigs: ShipConfigs
```

This method accepts an object `shipConfigs` where:

- **Keys**: Must be one of the values defined in `ShipType` (e.g., `'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat'`).
- **Values**: Each value is an object with:
  - A required `type` property of type `ShipType`.
  - An optional `version` property of type `Version` (e.g., `1990 | 2002`).

The use of optional properties means that not all ship types need to be included.

##### Logic

``` typescript
const fleet: Fleet = {};

for (const [shipType, config] of Object.entries(shipConfigs)) {
  fleet[shipType as ShipType] = new BattleshipFactory(
    config.type,
    config.version
  );
}

return fleet;
```

1. **Initialization**: `fleet` is initialized as an empty object conforming to the `Fleet` type.

2. **Destructuring with `Object.entries`**: Iterates over `shipConfigs`, extracting `shipType` (key) and `config` (value) pairs, allowing the `for...of` loop to process each entry.

3. **Populating `fleet`**: In each iteration, `shipType` is cast to `ShipType` and set as a key on `fleet`, with its value being a new `BattleshipFactory` instance created using the corresponding `config` values (`type` and `version`).

#### Static Methods: `createHasbroFleet()` and `createMBFleet()`

These static methods provide controlled ways to create instances of the class since the constructor is private and cannot be accessed directly. The `new` keyword is used internally within these methods, ensuring that instances are created according to the class's rules while preventing direct instantiation from outside the class.

Both methods return values that automatically conform to the `BattleshipFleetFactory` class since they instantiate the class directly. The primary difference between the methods lies in their ship configurations: Hasbro's (2002) fleet setup differs from Milton Bradley's (1990). The specific configuration differences are outside the scope of this documentation. Read the code, or read here: [Battleship Wikipedia](https://en.wikipedia.org/wiki/Battleship_(game))

### `createFleets` Utility Function

It simply creates an object containing player one and player twos fleets depending on the version (i.e, Hasbro - 2002 and Milton Bradley - 1990). It accepts the version _year_ in its parameters.

#### Instance Methods

##### `getShip`
<!-- TODO: -->