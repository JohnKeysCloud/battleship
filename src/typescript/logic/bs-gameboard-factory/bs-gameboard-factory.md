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

### `POSITION_STATES` Symbol Object

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
See [here](./helpers/get-valid-ship-positions/get-valid-ship-positions.md).

##### `resetBoard`
<!-- TODO: -->

##### `placePiece`
<!-- TODO: -->

##### `removePiece`
<!-- TODO: -->

#####  Getters
<!-- TODO: -->

### `createShipConfigurations` Utility Function
<!-- TODO: -->

### `createBattleshipBoardSet` Utility Function

This utility function simplifies the initialization of game boards for both players in the Battleship game. Instead of creating new instances of `BattleshipBoardFactory` in multiple modules, the `createBattleshipBoardSet` function handles the creation of two game board instances:

- `playerOne`: Represents the game board for Player One.
- `playerTwo`: Represents the game board for Player Two.

By centralizing the creation process, this function ensures consistent initialization across the application and reduces redundancy.