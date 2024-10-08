# Logic Types 
(alphabetized)

Some are very simple and thus self-explanatory, so those are listed here but contain no information 😅 

## Supplemental & Contextual Information 
(Unordered)

### `import type`

Using `import type` ensures that only type information is imported, which helps eliminate unused imports in the output code. It also prevents the import from being included in the compiled JavaScript, keeping the output cleaner and more efficient.

### `type` vs. `interface`

In TypeScript, both `interface` and `type` can be used to define the shape of objects, but they have some differences in capabilities and use cases.  

Building on the benefits of interfaces (See: [Benefits of an Interface](../bs-ship-builder/bs-ship-builder.md#benefits-of-an-interface)), here is a comparison between between them and TypeScripts, `type`. 

#### `interface`

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

#### `type`

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

#### Summary of Key Differences

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

### What is a **Mapped Type**?

A **mapped type** in TypeScript allows you to create a new `type` by transforming properties of an existing `type`. It uses a syntax that iterates over the keys of a type or union of string literals to create a new type where each key is transformed or mapped to a different type.

#### Syntax and Basic Usage

``` typescript
type NewType = {
  [Key in OldKeyType]: NewTypeValue;
};
```

* `Key`: represents each key in the old type (`OldKeyType`).
* `OldKeyType`: The type or union of string literals that defines the possible keys.
* `NewTypeValue`: The type for the values of these keys in the new type.

#### Examples

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
  [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipBuilder;
};
```

* `[key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']`: This part iterates over each key in the union of string literals.

* `?: BattleshipBuilder`: The type for each value associated with these keys is `BattleshipBuilder`. The `?` indicates that each property is optional. 

In this case, `Fleet` is a type where each key (one of the strings in the union) is an optional property with a value of type `BattleshipBuilder`.

`Fleet` only allows the properties specified in the union of string literals. Any property with a key not included in this list will result in a TypeScript error if you try to add it. 

**Advanced Usage**

Mapped Types can also include additional transformations and modifiers. For instance:

* **Read-only Mapped Type:** Makes all properties of a type read-only. This keyword makes the properties of any of your `type` immutable. This means that once the `type` object is created, the values of its properties cannot be reassigned or modified.

``` typescript
type ReadonlyFleet = {
  readonly [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipBuilder;
};

const myFleet: ReadonlyFleet = {
  carrier: new BattleshipBuilder(),
  battleship: new BattleshipBuilder(),
};

// Attempting to reassign a fleet property will cause a TypeScript error
myFleet.carrier = new BattleshipBuilder(); // Error: Cannot assign to 'carrier' because it is a read-only property.
```
Note that the `readonly` keyword only makes the existing properties of `myFleet` immutable; it does not prevent adding new properties to the object, provided that the new properties match the shape defined by the type. 

* **Partial Mapped Type:** Makes all properties optional.

### What's `enum`?

In TypeScript, an `enum` (short for "enumeration") is a way to define a set of named constants. Enumeration allow you to define a collection of related values that can be represented by names, making your code more readable and easier to manage. 

### `enum` vs `type`

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





#### Types of `emum`'s

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

#### Features of `enum`'s
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

#### Usage
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

### Benefits of an Interfaces

1. **Clear Contract for Implementations:** The interface defines a clear contract that any implementing class must adhere to. This ensures consistency across different implementations. For example, if you were to create another class that implements `IShipOptions`, you are guaranteed that it will have the properties `size`, `hitCounter` and `seaworthy`.

2. **Type Safety:** TypeScripts interfaces provide type safety by ensuring that the properties and methods in your class adhere to the specified types. This prevents errors like assigning an incorrect type to a property.

💭 Interfaces don't create custom types per se, but rather describe the shape of objects that are used with those types. They provide a contract that objects must adhere to.

3. **Reusability:** The `IShipOptions` interface can be reused in other parts of your code. For instance, if you have a function that operates on objects with these properties, you can type the function to accept `IShipOptions`, making your code more modular and flexible.

For example:

``` typescript
function printShipStatus(ship: IShipOptions): void {
  console.log(`Ship Type: ${ship.type}`);
  console.log(`Ship Size: ${ship.length}`);
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

5. **Documentation and Intellisense:** Using interfaces provides automatic documentation and better IntelliSense in code editors like VS Code. This helps us as developers understand what properties and types are expected when working with the `BattleshipBuilder` class or any other class that implements `IShipOptions`.

6. **Separation of Concerns:** By separating the structure (`IShipOptions`) from the behavior (methods of `BattleshipBuilder` instances), we maintain a clear distinction between what a ship "is" and what a ship "does." This separation can lead to cleaner and more maintainable code. 

7. **Default Values in Constructor:** In our `BattleshipBuilder` class, we have default values for `hitCounter` and `seaworthy` in the constructor. This simplifies object creation, as we don't need to specify all values when creating an instance. The interface helps ensure that even with default values, the structure remains consistent.

8. **Error Handling in Constructor:** The interface ensures that any class implementing it will respect the required types and properties. The constructor logic in `BattleshipBuilder`, like throwing an error if `size <= 0`, provides additional safeguards during object instantiation, ensuring no invalid ship objects are created. 

### `Interface` vs `Type`

Rather than using interfaces, which are ideal for object structures and extensibility, _types_ offer flexibility for a more general type manipulation; Hence, these types define smaller, reusable pieces that can then be used within interfaces or other types. 

💭 Think of types as building blocks or contracts for specific aspects, which can then be composed into more complex structures, such as interfaces. 

### Prepending `I` to Interface Name

This is a common, but not universal practice in some TypeScript codebases. It is mostly seen in older or certain large codebases. Even though some teams avoid this and name interfaces just like regular types, I decided to use the convention in this project because I am exporting and importing my interfaces into other modules. By prepending `I`, readability is enhanced in the modules where I import interfaces. It makes it clear that the import is an interface.

###  Tf is `<t>`

The `<T>` syntax, representing a generic type parameter, can be used anywhere in TypeScript where you want to define a generic type. Generics in TypeScript provide a way to create reusable and flexible components, functions, classes, and interfaces that work with a variety of data types while maintaining type safety.

#### Common Use Cases for `<T>` (Generics) in TypeScript

1. **Interfaces**:
   - You can use `<T>` to define a generic interface that works with any type.
```typescript
    interface Box<T> {
      content: T;
    }
```

2. **Functions**:
   - Generics are often used in function definitions to allow them to accept arguments of various types while still enforcing type constraints.
```typescript
    function identity<T>(arg: T): T {
      return arg;
    }
```

3. **Classes**:
   - You can define generic classes to work with different types while keeping type safety intact.
```typescript
    class GenericNumber<T> {
      zeroValue: T;
      add: (x: T, y: T) => T;
    }

    const myNumber = new GenericNumber<number>();
    myNumber.zeroValue = 0;
    myNumber.add = (x, y) => x + y;
```

4. **Type Aliases**:
   - Generics can also be used with type aliases to create reusable types.
```typescript
    type Pair<T, U> = {
      first: T;
      second: U;
    };
```

5. **React Components** (with TypeScript):
   - Generics are frequently used with React components to define props that can accept a variety of types.
```typescript
   interface Props<T> {
     items: T[];
   }

   function List<T>({ items }: Props<T>) {
     return (
       <ul>
         {items.map((item, index) => (
           <li key={index}>{item}</li>
         ))}
       </ul>
     );
   }

   // List accepts type parameter of T.
   // `{ items }` extracts the `items` property from the `Props<T>` object. 
   // `{ items }: Props<T>` ensures the argument confroms to the `Props<T>` interface.
```

6. **Utility Types**:
   - You can define utility types that work generically across multiple types.
```typescript
    type Nullable<T> = T | null;
```

#### Conclusion

Generics in TypeScript (`<T>`) can be used in a variety of contexts, such as functions, classes, interfaces, type aliases, and even within React components. They are incredibly powerful for writing reusable, type-safe code and are not limited to just interface declarations. You can use them anywhere you want to create flexible and maintainable code that works across different types.

### `<T extends symbol>`, `<T = symbol>` or the right way?

For instantiating Battleship boards, I  **decided** that the `fillValue` for the spaces on the board(s) should be represented as symbols, based on several factors mentioned [here](#position_states-symbol-object).

To ensure that only symbols are allowed for filling the gameboard, the class that instantiates the boards _could_ define the generic type placeholder `<T>` such that it extends the symbol type (`<T extends symbol>`). This approach would guarantee that, during the creation of class instances, only symbol and its subtypes are used. However, it would not prevent instantiation with subtypes that are not `symbol` itself (e.g., a subtype that is structurally compatible but not exactly `symbol`).

Because of this limitation and because I wanted to ensure that _only_ `symbol` is compatible with the class and its methods, I decided not to use this approach.

An alternative would be to assign the generic type explicitly via `<T = symbol>`, which emphasizes simplicity and consistency while sacrificing some flexibility. This approach disallows the use of `symbol` subtypes, such as `unique symbol`.

Of those 2 approaches, I'd go with the latter (`<T = symbol>`) for this particular scenario. The default `symbol` type is sufficient for my needs, and the added simplicity outweighs the potential benefits of supporting subtypes.

**Example:**

```typescript
class BattleshipBoard<T = symbol> {
  // Class implementation...
}

const board = new BattleshipBoard(); // T is inferred as `symbol`.
```

This decision would ensure that the implementation is straightforward and free from potential type issues related to subtype handling. If the requirements change in the future, adjusting the type constraint could be revisited with minimal refactoring.

The **advantages** of using `<T = symbol>` are as follows:

  - **Flexibility**: This approach allows for more flexibility if I want to support different types in the future. By using a default type (`symbol`), I can still allow users to specify another type if needed.

  - **Generic Programming**: If I anticipated needing different implementations or behaviors for other types, this approach gives me the option to accommodate that.

The **disadvantages** are:

  - **Potential Misuse**: Even though the default type is `symnbol`, users can still instantiate the class with a different type by explicitly specifying it (e.g, `new BattleShipBoard<string>()`). This may lead to unintended use cases or errors if the class methods aren't properly designed to handle types other than `symbol`.

  - **Not As Clear**: The intent isn't as explicit. Someone reading the code may assume the class is designed to be generic and flexible with different types, which does not align with my intention.

With those disadvantages in mind, I give you **my** way. The **right** way, for this specific project:

##### The Right Way

I decided that rather than setting the type on the class, that I would set an explicit type of `symbol` directly in the `implements` clause of my class. Seeing as my goal was to **strictly prevent** the class from being instantiated with any type other than `symbol`:

``` typescript
export class BattleshipBoardBuilder implements IGridGameboardSquare<symbol> {
  // Class implementation...
}
```

The **advantages** here are:

  - **Strict Enforcement**: By specifying `symbol` directly in the `implements` clause, the class is explicitly designed to work with `symbol` types only. It **prevents any attempts to instantiate the class with another type.**

  - **Clear Intent**: This makes it very clear to anyone reading my code that the class is strictly for `symbol` types. There is no ambiguity or room for misuse.

  - **No Generic Parameter Needed**: Since I'm not dealing with a generic type inside the class, it simplifies the code, making it easier to maintain and understand.

  - **Consistency**: Every use of `T` in my class is guaranteed to be `symbol`, and any method parameters or return types derived from `T` are automatically locked to `symbol`.

The **disadvantages**?:

  - **NONE!**: In my specific use case since I want to enforce `symbol` as the only type. This design choice is sufficient.

My work here is done.

#### Components Breakdown

1. **Type Parameters**:
   - **`N extends number`**: This defines a type parameter `N`, which is constrained to be a number. It represents the upper limit of the range.
   - **`Acc extends number[] = []`**: This defines another type parameter `Acc`, which defaults to an empty array (`[]`). It will accumulate numbers during the recursive calls.

2. **Base Case**:
   - **`Acc['length'] extends N`**: This checks if the current length of the accumulator array `Acc` is equal to `N`. If it is, this means we have accumulated enough numbers (from `0` to `N-1`).

   💭 As arrays are also objects, `['length']` is used to access the length property of the array object, which returns the length of the array.

   💭 `N extends number`, hence `N` must be of type `number`. `Acc['length'] extends N`. `N` is a subtype of `number` that in this case is equal to the maximum of the range. Therefore, this line performs a check to see if the length of the `acc` array is equal to `N`.

   - **`? Acc[number]`**: If the condition is true (i.e., the length of `Acc` is equal to `N`), it returns a union of all numbers in `Acc`. The `Acc[number]` syntax retrieves all values from the array type `Acc` as a union.

3. **Recursive Case**:
   - **`: Range<N, [...Acc, Acc['length']]>`**: If the length of `Acc` is not equal to `N`, it makes a recursive call to `Range`:
     - The first argument remains `N`.
     - The second argument is a new array, created by spreading `Acc` and appending the current length of `Acc` (`Acc['length']`).
     - This effectively adds the next number to the accumulator.

#### How It Works

1. **Initialization**: When you invoke `Range<5>`, it starts with `N` set to `5` and `Acc` set to its default value of `[]`.

2. **First Call**:
   - Checks if `Acc['length']` (which is `0` initially) extends `5`. It does not, so it moves to the recursive call.
   - It calls `Range<5, [0]>`.

3. **Subsequent Calls**:
   - The recursive process continues, each time checking the length of `Acc` and adding the current length to `Acc`.
   - The calls would look like this:
     - `Range<5, []>` (length is `0`)
     - `Range<5, [0]>` (length is `1`)
     - `Range<5, [0, 1]>` (length is `2`)
     - `Range<5, [0, 1, 2]>` (length is `3`)
     - `Range<5, [0, 1, 2, 3]>` (length is `4`)
     - `Range<5, [0, 1, 2, 3, 4]>` (length is `5`)

4. **Final Return**:
   - When `Acc` finally has a length of `5`, it returns `Acc[number]`, which will be `0 | 1 | 2 | 3 | 4`.

#### Summary

- The type `Range` generates a union type of numbers from `0` to `N-1`.
- It does this using a recursive approach, accumulating numbers in an array until the length of that array equals `N`.
- The base case returns the accumulated numbers as a union, while the recursive case continues to build the array until the condition is satisfied.

#### Example Usage

For example, invoking `Range<5>` would yield the type:

```typescript
type FiveRange = Range<5>; // Equivalent to 0 | 1 | 2 | 3 | 4
```

This approach leverages TypeScript's powerful type system to generate types based on recursive definitions, showcasing the utility of conditional types and mapped types.

## Enumerations

### `ShipType` Enumeration

As of 9/4/24, the Battleship board game features a variety of ship types, each with specific attributes and roles. To create a system that can effectively manage and distinguish between these ship types in the web implementation, I defined an `enum` called `ShipType`. This `enum` includes the various ship types as its members, such as `Carrier`, `Battleship`, `Cruiser`, `Destroyer`, `Submarine`, and `PatrolBoat`.

By using the `ShipType` `enum`, the code enforces type safety by ensuring that any value assigned to a variable of this type must correspond to one of the specified ship types. This approach provides a clear and structured way to handle different ship types, improving code readability and reducing the risk of errors by limiting the values to a defined set of constants.

## Types

### `AxisName` Type

Meh.

### `Coordinates` Type

Blah.

### `Fleet` Type (with side notes)

`Fleet` type is a _mapped type_. Below is a description of what this means:

``` typescript

// Explicit String Union
type Fleet = { [key in 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat']?: BattleshipBuilder; }

// Which is the same as:
// (Explicit Property Definition)
type Fleet = {
  carrier?: BattleshipBuilder, 
  battleship?: BattleshipBuilder, 
  destroyer?: BattleshipBuilder, 
  submarine?: BattleshipBuilder, 
  cruiser?: BattleshipBuilder, 
  patrolBoat?: BattleshipBuilder, 
}

// Which is also the same as:
// (`enum`-based definition)
type Fleet = {
  [key in ShipType]?: BattleshipBuilder;
};

```

The syntax uses a _mapped type_ to create an object type with specific keys and value types.

* `[key in ...]`: 
  - `key` is a placeholder and can be replaced with any valid identifier such as `K`, `T`, `ShipType`, or anything else that makes sense in your context. 

* The keys of the `Fleet` object must be one of the specified strings.

* The `?` after each key means that the property is optional. This means you could have a `Fleet` object without some of these properties.

* The value for each key must be of type `BattleshipBuilder`.

---

**✨ Side Note:**

Using the intersection operator (`&`) would result in an empty type because its impossible for a string to simultaneously be multiple unique strings. In other words, there is no **single string** that satisfies being both '`carrier`' and '`battleship`':

``` typescript
type Carrier = 'carrier';
type Battleship = 'battleship';

type CarrierAndBattleship = 'carrier' & 'battleship';
```

The **intersection logic** for `CarrierAndBattleship` _is_ valid TypeScript. But, in order to conform to the type, a variable would need to be assign to a string that is both '`carrier`' and '`battleship`' at the same time.

Though the logic is valid, the condition is **impossible**. A string cannot simultaneously be another. 

This results in an **empty type**- a type that doesn't have any possible values.

---

#### Pre-refactored Version

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
  [key in ShipType]?: BattleshipBuilder;
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

**✨ Side, Side Note: Tuples**

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
  [key in ShipType]?: BattleshipBuilder;
};
```

Creates a `type` where the keys of conforming objects must be in `ShipType`. The question mark here means the same as it did in the previous version of this `type` setup. The keys are all optional. Meaning that an object still conforms to the `Fleet` `type` if only some of they keys are present (so long as the keys _values_ conform to the `BattleshipBuilder` class).

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

Instead of duplicating a type definition for ship types in the fleet builder module, I created an enumeration (`enum`) of the ship types (declared [here](../types/logic-types.ts)). This change allows us to import the `ShipType` `enum` directly into the fleet builder module in order to maintain type safety. Additionally, this approach adheres to the DRY (Don't Repeat Yourself) principle by avoiding redundant type definitions. 

> Teaching while learning! 💭

### `FleetConfigs` Type

This `type` declaration is used to simplify the parameter definition of the `createFleet` static method, which is responsible for creating fleets and ensuring proper class instantiation. It defines the shape of the `fleetConfigs` object that the method accepts. It ensures that the object has keys that conform to `ShipType` and that the corresponding values conform to the `ShipConfig` type.

### `Orientation` Type

Bleh.

### `ShipSymbols` Type

Shrug.

### `ShipSymbolValue`

Creates a union of the keys in `ShipType`.

### `ShipConfig` Type

This `type` declaration is used to simplify the parameter definition of the `createFleet` static method, which is responsible for creating fleets and ensuring proper class instantiation. It specifies that the object should have a `type` key whose value conforms to `ShipType` and an optional `version` key whose value conforms to `Version`.

By using this type and the `FleetConfigs` type, the static method can enforce type safety and clear structure in the passed configurations, making the code more readable and maintainable.

### `SizeLookupKey` Type

The type `SizeLookupKey` is defined as `${ShipType}-${Version}`. This type ensures that the keys used in the `sizeLookup` table adhere to a specific format. By using this template literal type, TypeScript enforces that keys in the `sizeLookup` table must combine a valid `ShipType` with a valid Version, separated by a hyphen. This helps maintain consistency and type safety, making sure that only properly formatted keys are used throughout the code.

### `Version` Type

As of 9/4/24, there are two official versions of the Battleship board game, represented by the years 1990 and 2002. To create a flexible system that can distinguish between these versions in the web implementation, I defined an `type` called `Version`. This `type` includes these years as its members, and it is used to enforce type safety by ensuring that any value assigned to a variable of this type must match one of the specified years. This approach provides a strict type constraint that aligns with the official versions of the game, enhancing code clarity and reliability.

## Interfaces

### `IGridGameboard<T>` Interface

This interface defines the 'shape' of a gameboard grid. 

#### `readonly boardT[][]`

In deciding how to represent the gameboard, I opted for an adjacency matrix, which is implemented as a 2D array for simplicity in terms of both implementation and required functionality.

The `board` property of a class implementing this interface must conform to the type `T[][]`, meaning it is an array of arrays where each element is of the generic type `T`. The `<T>` parameter allows the grid to store different types of data, providing flexibility.

The notation `T[][]` follows this type-first declaration:
  1. The `T` in `T[][]` is the core type we are working with.
  2. The `[]` that comes after `T` indicates that this is an array of `T`.
  3. Adding another `[]` means this is an array of arrays of `T`.

The `readonly` modifier in the `board` property ensures that once an instance of the class is created, the `board` itself cannot be reassigned to a different array. However, you can still modify the contents of the `board` array (i.e., you can add, remove, or change elements within the `T[][]` structure).

**Therefore,** to replace the entire `board` array with a new array, you would need to create a new instance of the class, as the `readonly` keyword prevents direct reassignment of the `board` property. 

In summary, `readonly` does not make the board immutable; it only prevents the `board` variable from being reassigned to a new array.

#### `fillValue: T`, `placePiece()`, `removePiece()`, & `resetBoard()`

* `fillValue: T` ensures that our gameboard, when implementing the interface, has a `fillValue` of type T.

* `placePiece()` is another essential method. If you can't place a piece, why do we need a board?

* `removePiece()` follows the same logic. If you place pieces, you'll eventually need to remove them.

* `resetBoard()` is a method every gameboard should have. You need to reset the board either after a game ends or when someone flips it out of frustration due to sufficient decimation.

These methods provide basic functionality for any grid-based game, ensuring consistency and usability.

### `IGridGameboardSquare<T> extends IGridGameboard<T>` Interface

The `IGridGameboard<T>` interface defines a grid gameboard where the board is represented as a 2D array, allowing it to have any dimensions `x` by `y`. The `IGridGameboardSquare<T>` interface extends `IGridGameboard<T>` and introduces the `boardSize` property, which specifies a single dimension (`x`). This addition allows a class implementing `IGridGameboardSquare<T>` to generate a square gameboard, where both dimensions are equal (i.e., `x` by `x`). This provides a more specific use case for creating square gameboards compared to the more generic `IGridGameboard<T>`.

### `IPlacePieceWrapperParams` Interface

This interface defines the shape of the object that contains all but one necessary properties for placing a ship on the gameboard. This object is passed as a parameter to the [`placePiece`](../bs-gameboard-builder/bs-gameboard-builder.ts) method. 

### `IPlacePieceCallbackParams extends IShipPlacementConfigurations` Interface

This interface extends `IPlacePieceWrapperParams` and includes the last necessary property for placing a ship on the gameboard, the instance that contains the gameboard itself.

### The `IPosition` Interface

Pfft.

### `IShipOptions` Interface

`IShipOptions` is an `interface` that defines the structure of a `Ship` object including its properties and methods related to its state. 

The question mark (`?`) appended to `hitCounter` and `version` is used to indicate that the property is optional. 

In TypeScript, when a property is marked as optional, it means that classes or objects implementing the interface where the property exists may include the property, but it is not _required_ to do so.

### `IShipPlacementConfigurations` Interface

Defines the structure for the parameter of an outer function that wraps the validation logic. Since the nested callback function already has access to two of the five properties defined in `IValidPlacementCallbackParams`, these properties do not need to be passed as arguments when calling the wrapper function.

### `ITestCaseShipHit` Interface

Defines the shape of the object that holds the test cases for the `hit` method on ships including the number of hits and expected return values.

### `ITestCaseValidPositions` Interface

Defines the shape of the object that holds the test cases for the helper function `getValidShipPositions` which retrieves valid positions including the ship configurations and the expected result object containing the valid positions.


### `IValidPlacementCallbackParams extends IShipPlacementConfigurations` Interface

This interface defines the complete structure of the object needed to determine if a specific position on a Battleship gameboard is valid for ship placement. Any callback function that performs this validation must use an argument that conforms to this interface, ensuring all required data is available for the validation logic. This interface complies with the `IShipPlacementConfigurations` interface, so rather than writing a whole new interface, this one simply `extends` it and includes the added necessary property `gameboard`.

💭 You can also create interfaces that implement others that _omit_ properties using... `omit`. For example, the following is equivalent to the actual interface implementations:

``` typescript
export interface IValidPlacementCallbackParams {
  orientation: Orientation;
  gamePieceSize: number;
  gameboard: BattleshipBoardBuilder;
}

export interface IShipPlacementConfigurations extends Omit<IValidPlacementCallbackParams, 'gameboard'> { };
```

### `IValidPositionsResult` Interface

The full object that contains all valid positions for any given ship after running `getValidShipPositions` contains objects that conform to this interface. The keys must be in [`AxisName`](#axisname-type) format and the values are arrays filled with objects that conform to the [`IPosition`](#the-iposition-interface) interface.


