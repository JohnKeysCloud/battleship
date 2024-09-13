## `bs-gameboard.ts`

### Supplemental & Contextual Information

#### Whats a `Symbol` Yo?!

Using `Symbol`s in JavaScript provides several advantages, particularly when dealing with scenarios like my battleship game board implementation. 

**Here's a list of benefits of using `Symbols` over other data structures or types for simple purposes:**

##### 1. **Uniqueness and Collision Avoidance**
   - **Guaranteed Uniqueness**: Each `Symbol` is unique, even if created with the same description. This ensures that keys or values using `Symbols` won't accidentally collide with others, which is especially useful in shared or global environments.
   - **Prevents Accidental Overwrites**: When you use `Symbols` as keys in objects or elements in arrays, there is no risk of overwriting existing properties or values that might use the same string or number key.

##### 2. **Hidden Properties**
   - **Non-Enumerable by Default**: Properties defined using `Symbols` are not enumerable by default, meaning they don’t show up in loops like `for...in` or when using `Object.keys`. This makes them ideal for adding metadata or "hidden" properties that shouldn’t interfere with normal object operations.
   - **Enhanced Privacy**: Because `Symbols` are not accessible via typical object property access patterns, they provide a weak form of encapsulation. Other code won’t accidentally interact with or modify properties that use `Symbols` as keys.

##### 3. **Clarity and Intentionality**
   - **Clear Semantics**: Using `Symbols` can make your code more expressive and intentional. For example, by using `Symbol('VACANT')` and `Symbol('OCCUPIED')`, it’s clear that these values are meant to represent specific states on the board, rather than generic strings or numbers that could be misunderstood or misused.
   - **Avoiding String Comparisons**: Instead of comparing strings (which can be error-prone if there are typos or case differences), you can compare `Symbols` directly, ensuring that only the exact intended state or value is matched.

##### 4. **Immutable Constants**
   - **Immutable by Nature**: `Symbols` are immutable once created, meaning their value cannot be changed. This is useful for defining constants, like different states of your game board, that should never be altered.

##### 5. **Compatibility with Various Data Structures**
   - **Usage in Objects and Arrays**: `Symbols` can be used as keys in objects and as values in arrays or sets, making them versatile across different data structures. This is particularly helpful when you need unique identifiers within data collections.

##### 6. **Well-Suited for Symbolic Logic**
   - **Representing Abstract Concepts**: `Symbols` are ideal for representing abstract concepts or unique states, such as `'VACANT'` and `'OCCUPIED'` on a game board, without the risk of overlap with other strings or numbers in your code.

##### 7. **Enhanced Integration with Libraries**
   - **Interoperability**: Many JavaScript libraries and frameworks (e.g., Redux) utilize `Symbols` for defining action types or unique keys. By understanding and using `Symbols`, your code can integrate more effectively with such tools, ensuring compatibility and preventing naming conflicts.

##### 8. **Reduced Risk of Magic Strings**
   - **Avoids "Magic Strings"**: Using `Symbols` helps to avoid the pitfalls of "magic strings" (hard-coded strings that are used for logic decisions). Magic strings can be error-prone and hard to refactor, while `Symbols` provide a more robust and maintainable alternative.

##### 9. **Lightweight and Performance-Friendly**
   - **Minimal Memory Overhead**: `Symbols` are lightweight and don't carry the same memory overhead as some other data structures, making them efficient for scenarios like filling arrays or marking states.

#### Gameboard Representation: Adjacency Matrix vs. Adjacency List

##### Adjacency List Benefits

1. **Memory Efficient**: Only stores existing edges, making it more space-efficient, especially for sparse boards or large graphs.
2. **Flexible Topology**: Easily adapts to irregular grids, varying connections, or dynamic board sizes.
3. **Fast Traversal**: Efficiently traverses neighbors, ideal for algorithms like pathfinding or checking connectivity.
4. **Dynamic Updates**: Simple to add or remove nodes and edges, allowing for easy modifications to the board’s layout.
5. **Supports Complex Movement**: Handles non-standard moves, like wraparounds or teleportation, more easily than a grid.

##### Adjacency Matrix (2D Array) Benefits 

1. **Simple Representation**: Easy to implement and visualize, especially for small, fixed-size grids.
2. **Constant-Time Access**: O(1) time complexity for checking if an edge exists between nodes, which is great for dense graphs or frequent access.
3. **Efficient for Dense Grids**: Performs well when most positions are connected, reducing overhead from sparse data structures.
4. **Ideal for Grid-Based Games**: Naturally represents gameboards, where each cell's direct neighbors are easily accessible.
5. **Supports Uniform Movement**: Easily handles standard directional movements (up, down, left, right) with predictable index access.

####  Tf is `<t>`

The `<T>` syntax, representing a generic type parameter, can be used anywhere in TypeScript where you want to define a generic type. Generics in TypeScript provide a way to create reusable and flexible components, functions, classes, and interfaces that work with a variety of data types while maintaining type safety.

##### Common Use Cases for `<T>` (Generics) in TypeScript

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

##### Conclusion

Generics in TypeScript (`<T>`) can be used in a variety of contexts, such as functions, classes, interfaces, type aliases, and even within React components. They are incredibly powerful for writing reusable, type-safe code and are not limited to just interface declarations. You can use them anywhere you want to create flexible and maintainable code that works across different types.

#### `<T extends symbol>`, `<T = symbol>` or the right way?

For instantiating Battleship boards, I  **decided** that the `fillValue` for the spaces on the board(s) should be represented as symbols, based on several factors mentioned [here](./helpers/validate-placement/validate-placement.md#vacant-occupied-symbols).

To ensure that only symbols are allowed for filling the gameboard, the class that instantiates the boards _could_ define the generic type placeholder `<T>` such that it extends the symbol type (`<T extends symbol>`). This approach would guarantee that, during the creation of class instances, only symbol and its subtypes are used. However, it would not prevent instantiation with subtypes that are not `symbol` itself (e.g., a subtype that is structurally compatible but not exactly `symbol`).

Because of this limitation and because I wanted to ensure that _only_ `symbol` is compatible with the class and its methods, I decided not to use this approach.

An alternative would be to assign the generic type explicitly via `<T = symbol>`, which emphasizes simplicity and consistency while sacrificing some flexibility. This approach disallows the use of `symbol` subtypes, such as `unique symbol`.

Of those 2 options, I'd go with the latter (`<T = symbol>`) for this particular scenario. The default `symbol` type is sufficient for my needs, and the added simplicity outweighs the potential benefits of supporting subtypes.

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

_Finally_, I decided that rather than setting the type on the class, that I would set an explicit type of `symbol` directly in the `implements` clause of my class. Seeing as my goal was to **strictly prevent** the class from being instantiated with any type other than `symbol`:

``` typescript
export class BattleshipBoardFactory implements IGridGameboardSquare<symbol> {
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

#### `POSITION_STATES` Symbol Object

When considering initial values for filling the game board, I faced a dilemma.

Using `null` seemed like a reasonable choice both syntactically and semantically, as it could signify the intentional absence of any value, a "placeholder" for empty spaces on the board.

Problem solved... almost. What about the values once they become `OCCUPIED`?

I considered setting them to `true`, which would work syntactically; an `isOccupied` variable could easily handle such a boolean state. However, `true` lacks semantic clarity, what does `true` really represent in this context?

Then I stumbled upon `Symbol`s. Aha! A unique and descriptive approach for handling game board states.

[Here is what I learned on my exploration of `Symbol`s](#whats-a-symbol-yo)

In my battleship gameboard implementation, I use `Symbol('V')` stored as `vacant` and `Symbol('O')` stored as `occupied` in the `POSITION_STATES` object to fill a 2D array. This approach ensures:
   - **No Collisions**: Other parts of the code won't mistakenly overwrite or interact with these values.
   - **Clear Intent**: It's clear what each `Symbol` represents, improving code readability.
   - **Efficient State Management**: I manage the state of the board in a lightweight, performance-friendly manner without the risk of confusing states or accidental changes.

By leveraging `Symbols`, I am taking advantage of their unique and immutable nature, enhancing the robustness and clarity of my code.

I gave the symbols single letter descriptors (accessible via a symbols `.description` property) so that when printing our board to see the values, instead of seeing an insurmountable amount of  `vacant` or `occupied` strings, we'd see single letters in monospace, giving the gameboard symmetry, enhancing readability. 

They are stored in the `POSITION_STATES` object for organizational purposes.

### `IGridGameboard<T>` Interface & Members

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

### `ValidPlacementWrapperParams` & `ValidPlacementCallbackParams` Interfaces

* **`ValidPlacementWrapperParams`**: This interface defines the structure for the parameter of an outer function that wraps the validation logic. Since the nested callback function already has access to two of the five properties defined in `ValidPlacementCallbackParams`, these properties do not need to be passed as arguments when calling the wrapper function. To enforce this structure, `ValidPlacementWrapperParams` extends `ValidPlacementCallbackParams` but omits the two redundant properties, ensuring type safety and reducing redundancy.

* **`ValidPlacementCallbackParams`**: This interface defines the complete structure of the object needed to determine if a specific position on a Battleship gameboard is valid for ship placement. Any callback function that performs this validation must use an argument that conforms to this interface, ensuring all required data is available for the validation logic.

### `BattleshipBoardFactory implements IGridGameboardSquare<symbol>` Class

Alas, we have our "what it is" (`interface`) and now we can decide "what it does" (`class`). 

💭 The reasoning for why I explicitly set the  type of `symbol` directly in the `implements` clause of my class can be found [above](#the-right-way).

#### The Properties

* **`private readonly _board: symbol[][]`:** The `_board` property is private to encapsulate the internal state within the `BattleshipBoard` class. By making it private, we prevent external code from directly accessing or modifying the board, ensuring all interactions are controlled through the class’s methods, thereby maintaining the board's integrity.

The property is marked as `readonly` to prevent the `_board` from being reassigned to a new array. This decision promotes:

- **Memory Efficiency:** Resetting values in-place avoids allocating new memory for the entire array.
- **Consistency:** All references to the `_board` remain valid, as the array object itself is never replaced, only modified.
- **Controlled Mutability:** By making `_board` `readonly`, we prevent accidental reassignment, maintaining a consistent object reference.

However, this approach trades off some performance (since creating a new array is often faster) and adds a bit more code complexity (due to the need for an iterative reset process).

* **`private readonly _boardSize: number = 10`:** This private, read-only property defines the standard size of the Battleship board. It being private ensures that the board size cannot be accessed or modified directly from outside the class. Marking it as `readonly` guarantees that the board size is fixed upon initialization and cannot be changed later, ensuring consistency throughout the board's lifecycle.

* **`private readonly _fillValue: symbol = Symbol('V')`:** This private, read-only property represents the default fill value used to initialize and reset the board cells. Being private ensures that the property cannot be accessed or modified directly from outside the class. The `readonly` keyword ensures that once `_fillValue` is set during the instantiation of `BattleshipBoard`, it remains constant throughout the lifetime of the instance. This design choice helps maintain a consistent fill state across the board and prevents unintended changes to the fill value.

In the pre-refactored version (before I applied the fixed type of `symbol` in the refactored logic and used a _generic type_ of `<T>`) of the class logic, I used the `as T` type assertion in the declaration `private readonly _fillValue: T = Symbol('V') as T`. In order to satisfy the TypeScript type system when initializing a property with a generic type `T` that extends `symbol`. `BattleshipBoard` used a generic type parameter `T` constrained to `symbol` types, which means `T` can be any type that is a subtype of `symbol`. A potential subtype in TypeScript is `unique symbol` (more [here](https://www.typescriptlang.org/docs/handbook/symbols.html#:~:text=unique%20symbol%20is%20a%20subtype,to%20use%20the%20typeof%20operator.)). This was when I realized the disadvantage to using a generic type in my class. 

When initializing `_fillValue` with `Symbol('V')`, TypeScript infers the type as `symbol`. However, this does not guarantee that this `symbol` specifically matches the generic type `T`, which could be any subtype of `symbol`. To satisfy the TypeScript compiler and indicate that we are intentionally assigning a `symbol` to a variable of type `T`, we use the `as T` type assertion. This tells TypeScript, "Trust me, `Symbol('V')` will work as type `T`." 

The issue with this logic is that it allowed the instantiation of the class with incompatible subtypes which would result in runtime errors. Hence the switch to the explicit `symbol` type declaration in the `implements` clause of the class. This also had a side-effect of simplifying the logic, allowing the safe removal of `as T`. 

#### The Constructor

The `BattleshipBoard` class constructor does not require arguments because it relies on default values defined within the class. Instead, the construction body initializes the board using these pre-defined private properties:

- **Private Properties:**
  - **`_boardSize`:** A constant value set to the default board size.
  - **`_fillValue`:** A default fill value used to initialize the board cells.

During construction, the board is dynamically generated as a 2D array based on these private properties. This approach encapsulates the initialization logic within the class and ensures that the board’s size and fill value remain consistent, following the rules defined by the class.

#### Instance Methods

##### `getValidShipPositions`
See [here](./helpers/get-valid-positions/get-valid-positions.md).

##### `resetBoard`
<!-- TODO: -->

##### `placePiece`
<!-- TODO: -->

##### `removePiece`
<!-- TODO: -->

#####  Getters
<!-- TODO: -->
