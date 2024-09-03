## `bs-gameboard.ts`

### Supplemental & Contextual Information

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

### `IGridGameboard<T>` Interface & Members

This interface defines the 'shape' of a gameboard grid. 

####  Tf is `<t>`

The <T> in interface `IGridGameboard<T`> is a generic type parameter. It allows `IGridGameboard` to be flexible and reusable with different types of data, without specifying a type upfront. `T` acts as a placeholder that will be replaced with a specific type when the interface is implemented.

By using <T>, the interface can handle a variety of data types, making it versatile for different use cases. For example, `IGridGameboard<number>`, `IGridGameboard<string>`, or `IGridGameboard<MyCustomType>` could all be valid instantiations, depending on what the grid is meant to store.

Generics like this provide type safety while avoiding the redundancy of creating multiple interfaces for different types.

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

#### `fillValue: T`, `resetBoard()`, `placePiece()` & `removePiece()`

* `fillValue: T` ensures that our gameboard, when implementing the interface, has a `fillValue` of type T.

* `resetBoard()` is a method every gameboard should have. You need to reset the board either after a game ends or when someone flips it out of frustration due to sufficient decimation.

* `placePiece()` is another essential method. If you can't place a piece, why do we need a board?

* `removePiece()` follows the same logic. If you place pieces, you'll eventually need to remove them.

These methods provide basic functionality for any grid-based game, ensuring consistency and usability.

### `IGridGameboardSquare<T> extends IGridGameboard<T>` Interface

The `IGridGameboard<T>` interface defines a grid gameboard where the board is represented as a 2D array, allowing it to have any dimensions `x` by `y`. The `IGridGameboardSquare<T>` interface extends `IGridGameboard<T>` and introduces the `boardSize` property, which specifies a single dimension (`x`). This addition allows a class implementing `IGridGameboardSquare<T>` to generate a square gameboard, where both dimensions are equal (`x` by `x`). This provides a more specific use case for creating square gameboards compared to the more generic `IGridGameboard<T>`.


### `BattleshipBoard<T extends symbol> implements IGridGameboardSquare<T>` Class

Alas, we have our "what it is" (`interface`) and now we can decide "what it does" (`class`). 

#### `<T extends symbol>` or `<T = symbol>`?

For instantiating Battleship boards, I **decided** that the `fillValue` for the spaces on the board(s) should be represented as symbols, based on several factors mentioned [here](./helpers/check-valid-placement/check-valid-placement.md#vacant-occupied-symbols).

To ensure that symbols are the only allowed type for filling the gameboard, the class that instantiates the boards could define the generic type placeholder `<T>` such that it extends the `symbol` type. This approach would guarantee that, during the creation of class instances, only `symbol` and its _subtypes_ are used, preventing type errors during construction. 

An alternative would be to assign the generic type explicitly via `<T = symbol>`, which emphasizes simplicity and consistency while sacrificing some flexibility. This approach disallows the use of `symbol` subtypes, such as `unique symbol`.

Of those 2 options, I'd go with the latter (`<T = symbol>`) for this particular scenario. The default `symbol` type is sufficient for my needs, and the added simplicity outweighs the potential benefits of supporting subtypes.

**However**, I decided that instead of allowing a generic type for my class, I'd set a fixed type. This removes more flexibility, as now instances of the class can only be created with symbols, but, that's exactly the point. The benefits to this approach is as follows:

**Example:**

```typescript
class BattleshipBoard<T = symbol> {
  // Class implementation...
}

const board = new BattleshipBoard(); // T is inferred as `symbol`.
```

This decision ensures that the implementation is straightforward and free from potential type issues related to subtype handling. If the requirements change in the future, adjusting the type constraint could be revisited with minimal refactoring.

#### The Properties

* **`private readonly _board: T[][]`:** The `_board` property is private to encapsulate the internal state within the `BattleshipBoard` class. By making it private, we prevent external code from directly accessing or modifying the board, ensuring all interactions are controlled through the class’s methods, thereby maintaining the board's integrity.

The property is marked as `readonly` to prevent the `_board` from being reassigned to a new array. This decision promotes:

- **Memory Efficiency:** Resetting values in-place avoids allocating new memory for the entire array.
- **Consistency:** All references to the `_board` remain valid, as the array object itself is never replaced, only modified.
- **Controlled Mutability:** By making `_board` `readonly`, we prevent accidental reassignment, maintaining a consistent object reference.

However, this approach trades off some performance (since creating a new array is often faster) and adds a bit more code complexity (due to the need for an iterative reset process).

* **`private readonly _boardSize: number = 10`:** This private, read-only property defines the standard size of the Battleship board. It being private ensures that the board size cannot be accessed or modified directly from outside the class. Marking it as `readonly` guarantees that the board size is fixed upon initialization and cannot be changed later, ensuring consistency throughout the board's lifecycle.

* **`private readonly _fillValue: T = Symbol('V')`:** This private, read-only property represents the default fill value used to initialize and reset the board cells. Being private ensures that the property cannot be accessed or modified directly from outside the class. The `readonly` keyword ensures that once `_fillValue` is set during the instantiation of `BattleshipBoard`, it remains constant throughout the lifetime of the instance. This design choice helps maintain a consistent fill state across the board and prevents unintended changes to the fill value.

The pre-refactored logic used `as T`type assertion (before I applied the fixed type of `symbol` in the refactored logic) in the declaration `private readonly _fillValue: T = Symbol('V') as T`. In order to satisfy the TypeScript type system when initializing a property with a generic type `T` that extends `symbol`. `BattleshipBoard` used a generic type parameter `T` constrained to `symbol` types, which means `T` can be any type that is a subtype of `symbol`. A potential subtype in TypeScript is `unique symbol` (more [here](https://www.typescriptlang.org/docs/handbook/symbols.html#:~:text=unique%20symbol%20is%20a%20subtype,to%20use%20the%20typeof%20operator.)).

When initializing `_fillValue` with `Symbol('V')`, TypeScript infers the type as `symbol`. However, this does not guarantee that this `symbol` specifically matches the generic type `T`, which could be any subtype of `symbol`. To satisfy the TypeScript compiler and indicate that we are intentionally assigning a `symbol` to a variable of type `T`, we use the `as T` type assertion. This tells TypeScript, "Trust me, `Symbol('V')` will work as type `T`." 

The issue with this logic is that it allowed the instantiation of the class with incompatible types which would result in runtime errors. Hence the switch to a fixed `type`. This also had a side-effect of simplifying the logic, allowing the safe removal of `as T`. 

#### The Constructor

The `BattleshipBoard` class constructor does not require arguments because it relies on default values defined within the class. Instead, the construction body initializes the board using these pre-defined private properties:

- **Private Properties:**
  - **`_boardSize`:** A constant value set to the default board size.
  - **`_fillValue`:** A default fill value used to initialize the board cells.

During construction, the board is dynamically generated as a 2D array based on these private properties. This approach encapsulates the initialization logic within the class and ensures that the board’s size and fill value remain consistent, following the rules defined by the class.

#### Instance Methods

##### `checkValidShipPlacement`
See [here](./helpers/check-valid-placement/check-valid-placement.md).

##### `resetBoard`
<!-- TODO: -->

##### `placePiece`
<!-- TODO: -->

##### `removePiece`
<!-- TODO: -->

#####  Getters
<!-- TODO: -->
