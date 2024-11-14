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
   - **Clear Semantics**: Using `Symbols` can make your code more expressive and intentional. For example, by using `Symbol('VC')` (for vacant) and `Symbol('CA')` (for carrier), it’s clear that these values are meant to represent specific states on the board, rather than generic strings or numbers that could be misunderstood or misused.
   - **Avoiding String Comparisons**: Instead of comparing strings (which can be error-prone if there are typos or case differences), you can compare `Symbols` directly, ensuring that only the exact intended state or value is matched.

##### 4. **Immutable Constants**
   - **Immutable by Nature**: `Symbols` are immutable once created, meaning their value cannot be changed. This is useful for defining constants, like different states of your game board, that should never be altered.

##### 5. **Compatibility with Various Data Structures**
   - **Usage in Objects and Arrays**: `Symbols` can be used as keys in objects and as values in arrays or sets, making them versatile across different data structures. This is particularly helpful when you need unique identifiers within data collections.

##### 6. **Well-Suited for Symbolic Logic**
   - **Representing Abstract Concepts**: `Symbols` are ideal for representing abstract concepts or unique states, such as vacancy or ship-type on a game board, without the risk of overlap with other strings or numbers in your code.

##### 7. **Enhanced Integration with Libraries**
   - **Interoperability**: Many JavaScript libraries and frameworks (e.g., Redux) utilize `Symbols` for defining action types or unique keys. By understanding and using `Symbols`, your code can integrate more effectively with such tools, ensuring compatibility and preventing naming conflicts.

##### 8. **Reduced Risk of Magic Strings**
   - **Avoids "Magic Strings"**: Using `Symbols` helps to avoid the pitfalls of "magic strings" (hard-coded strings that are used for logic decisions). Magic strings can be error-prone and hard to refactor, while `Symbols` provide a more robust and maintainable alternative.

##### 9. **Lightweight and Performance-Friendly**
   - **Minimal Memory Overhead**: `Symbols` are lightweight and don't carry the same memory overhead as some other data structures, making them efficient for scenarios like filling arrays or marking states.

#### Why symbols in Battleship Implementation?

When considering initial values for filling the game board, I faced a dilemma.

Using `null` seemed like a reasonable choice both syntactically and semantically, as it could signify the intentional absence of any value, a "placeholder" for empty spaces on the board.

Problem solved... almost. What about the values once they become occupied?

I considered setting them to `true`, which would work syntactically; an `isOccupied` variable could easily handle such a boolean state. However, `true` lacks semantic clarity, what does `true` really represent in this context?

Then I stumbled upon `Symbol`s. Aha! A unique and descriptive approach for handling game board states.

[Here is what I learned on my exploration of `Symbol`s](#whats-a-symbol-yo)

In my battleship gameboard implementation, I use `Symbol('VC')` and other symbols with 2-letter labels to represent the various ship types. This approach ensures:
   - **No Collisions**: Other parts of the code won't mistakenly overwrite or interact with these values.
   - **Clear Intent**: It's clear what each `Symbol` represents, improving code readability.
   - **Efficient State Management**: I manage the state of the board in a lightweight, performance-friendly manner without the risk of confusing states or accidental changes.

By leveraging `Symbols`, I am taking advantage of their unique and immutable nature, enhancing the robustness and clarity of my code.

The reason why I gave the symbols 2-letter descriptors (accessible via a symbols `.description` property) so that when printing our board to see the values, instead of seeing an insurmountable amount of `vacant` or ship-type strings, we'd see 2-letters in monospace in each position, giving the gameboard symmetry, enhancing readability. 

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

#### 2D Array Implementation

The main difference between the two pieces of code lies in how they create the 10x10 grid of values. Both will produce a 10x10 array (grid) filled with `testBoard.fillValue`, but the way they achieve this is slightly different:

1. **First approach:** 👎 (**doesn't work** for my Battleship board 2D array implementation)

```js
   const expectedBoard = Array.from({ length: 10 }, () =>
     Array.from({ length: 10 }, () => testBoard.fillValue)
   );
```

   - **Explanation**: 
      - `Array.from({ length: 10 }, () => Array.from(...))` creates an outer array with 10 elements.
      - Inside, it uses another `Array.from` to create each inner array. The callback `() => testBoard.fillValue` is invoked for each element of the inner array, meaning `testBoard.fillValue` is evaluated and assigned **independently** for every element.
      - **Effect**: Each element in the 10x10 array will be a _fresh instance_ of `testBoard.fillValue` for every position in the grid.

2. **Second approach:** 👍 (**does work** for my Battleship board 2D array implementation)

```js
   Array.from({ length: 10 }, () =>
     Array(10).fill(testBoard.fillValue)
   );
```

   - **Explanation**: 
      - The outer `Array.from` still creates the outer array with 10 elements.
      - Inside, it creates each inner array using `Array(10).fill(testBoard.fillValue)`. This creates an array of 10 elements where every element **references the same instance** of `testBoard.fillValue`.
      - **Effect**: Each inner array will have 10 identical values, but they are all references to the same `testBoard.fillValue`. If `testBoard.fillValue` is a primitive value (like a number or string), this difference doesn’t matter. However, if it's an object or array, modifying one cell would affect all cells in the same row, since they share the same reference.

##### Key Differences:
- **First approach** (`Array.from` with a callback):
  - Creates new independent values for each element in the 10x10 array. This is especially important if `testBoard.fillValue` is an object or array. This approach is akin to creating a 2D array using a nested `for loop` where the `symbol` fill value is declared _within_ the loop (fresh instances).
  
- **Second approach** (`Array.fill`):
  - Uses the same reference for every element in each inner array. If `testBoard.fillValue` is an object or array, this could lead to unexpected side effects if the value is modified later. This approach is akin to creating a 2D array using a nested `for loop` where the `symbol` fill value is declared _outside_ the loop (fresh instances).

##### Conclusion:
If `testBoard.fillValue` is a primitive value (e.g., a number or string), both approaches will behave similarly. If `testBoard.fillValue` is an object or array, the **first approach** is safer as it ensures each cell in the grid is independent.

### `BattleshipBoardBuilder implements IGridGameboardSquare<symbol>` Class

Alas, we have our _"what it is"_ (the `interface`) and now we can decide _"what it does"_ (the `class`). 

💭 The reasoning for why I explicitly set the type of `symbol` directly in the `implements` clause of my class can be found [here](../types/logic-types.md#the-right-way).

#### The Properties

*  **`private static readonly vacant = Symbol('VC')`**: 
   In order to ensure that the same reference of the vacant `symbol` is used for the entire lifecycle of the gameboards, I created a `static` property of the class which stores this instance. If I had explicitly set the `_fillValue` property to a value of `Symbol('VC)`, it wouldn't be a guarantee that the reference would be consistent in all scenarios.

   For example:

```typescript
   const playerOne = BattleshipBoardBuilder.createHasbroFleet();
   const playerTwo = BattleshipBoardBuilder.createHasbroFleet();
   console.log(playerOne.fillValue === playerTwo.fillValue); // false
```

   A property being `readonly` and `private` prevents mutability and external manipulation.

* **`private readonly _board: symbol[][]`**: 
   The `_board` property is private to encapsulate the internal state within the `BattleshipBoard` class. This prevents external code from directly accessing or modifying the board, ensuring all interactions are controlled through the class’s methods.

   The property is marked as `readonly` to prevent the `_board` from being reassigned to a new array.

* **`private readonly _boardSize: number = 10`**: 
   This property defines the standard size of the Battleship board. 

* **`private readonly _fillValue: symbol = BattleshipBoardBuilder.vacant`**: 
   This property represents the default fill value used to initialize and reset the board cells.

   In the pre-refactored version, the class used a generic type constraint `<T extends symbol>`, allowing any subtype of `symbol`, such as [`unique symbol`](https://www.typescriptlang.org/docs/handbook/symbols.html#:~:text=unique%20symbol%20is%20a%20subtype,to%20use%20the%20typeof%20operator). This made a type assertion (`as T`) necessary to ensure that `Symbol('VC')` was interpreted by TypeScript as type `T`. However, this flexibility introduced the risk of runtime errors due to the logic being incompatible with subtypes.

   By explicitly using the `symbol` type in the `implements` clause, we guarantee type consistency, remove the need for type assertions, and simplify the code, ensuring safer and more predictable behavior.

#### The Constructor

The `BattleshipBoard` class constructor does not require parameters because it relies on default values defined within the class. Instead, the construction body initializes the board using these pre-defined private properties:

Instantiation doesn't require any constructor parameters, as the board is dynamically generated as a 2D array based on the private properties. This approach encapsulates the initialization logic within the class and ensures that the board’s size and fill value remain consistent, following the rules defined by the class.

There are many ways to create a 2D array. The implementation within the constructor body is intentional in design (more info [here](#2d-array-implementation)). 

#### Instance Methods

##### `getValidPositions`
See [here](./helpers/get-valid-ship-positions/get-valid-ship-positions.md).

##### `resetBoard`
<!-- TODO: -->

##### `placePiece`
See [here](./helpers/place-ship/place-ship.md).

##### `removePiece`
<!-- TODO: -->

### `createShipConfigurations` Factory Function

This factory function returns an object that complies with the `IShipPlacementConfigurations` interface. It is a common and _recommended_ way to create an object that adheres to an interface in TypeScript. Such functions remove the need for explicit type assertions (which can bypass some of TypeScript's safeguards.), leveraging the full power of TypeScripts type safety, catching potential mismatches at compile time. Another added benefit is _encapsulation_. Encapsulating the object creation logic makes it easier to modify or extend in the future. Lastly, it also enhances readability, clearly showing that the function returns a specific shape of data that adheres to the `IShipPlacementConfigurations` interface.

### `createBattleshipBoardBuilderSet` Factory Function

This factory function simplifies the initialization of game boards for both players in the Battleship game. Instead of creating new instances of `BattleshipBoardBuilder` in multiple modules, the `createBattleshipBoardBuilderSet` function handles the creation of two game board instances:

- `playerOne`: Represents the game board for Player One.
- `playerTwo`: Represents the game board for Player Two.

By centralizing the creation process, this function ensures consistent initialization across the application and reduces redundancy.