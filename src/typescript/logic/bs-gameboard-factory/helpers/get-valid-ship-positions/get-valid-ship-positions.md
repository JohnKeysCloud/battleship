## `get-valid-ship-positions.ts`

This function identifies all valid positions for placing a game piece of a specified size on a game board, based on its orientation (horizontal or vertical). It verifies that the piece fits within the board's boundaries and that all required spaces are unoccupied. The function returns an array of positions where the piece can be placed without overlapping existing pieces or exceeding the board’s edges.

### The Meat & Potatoes - `getValidPositions`

#### Parameters

This function takes in vital information (in the form of a destructured object) to determine whether or not a particularly precise position is a valid for game-piece placement:

  * `direction`: This parameter checks the orientation of the ship being placed. This will determine whether the algorithm checks rows or columns for potential valid positions.

  * `gamePieceSize`: The amount of units on the gameboard that our piece takes up. To determine whether the piece would fit in the provided row/column.

---

> In my writing of this documentation, at this very moment, I had an epiphany. "Maybe I should add logic for ships with a size of `1`," as I've seen several implementations of the game with such ships. Before I do that though, let me refer back to the games Wikipedia page. *_2 minutes later_* Ah! I've discovered that the smallest ship in Battleship has a size of `2` units! Work smarter not harder my friends. Now, all I have to do refactor my `gamePieceSize` constraint checks. It's a lot easier to make this small change than to add the logic for a piece that won't exist! Rules. Without them, we might as well live with the animals. 💭

``` typescript
  // Validate piece length

  // Out with the old:
  if (pieceLength <= 0) {
    throw new Error('Ship length must be greater than zero.');
  }

  // In with the new:
  if (gamePieceSize < 2 || gamePieceSize > 5) {
    throw new Error('Invalid piece length. Game piece length must be between 2 and 5.');
  }
```

--- 

  * `gameboard`: This parameter expects the gameboard object as its argument. As we are preparing to _mutate_ it with ship additions. 
  
  In looping through the current row/column of the `gameboard`:
    * Depending on the orientation,
    * The size of the ship,
    * and the information provided by the gameboard that tells us which positions in the `axisArray` are `OCCUPIED`…
    
  The algorithm is able to determine whether or not there is space for the current ship being placed and its specific size.

  Also, the board size is extracted from the `gameboard` argument. It determines the size of the `for` loops when iterating through rows and/or columns to determine whether or not the ship fits. This is vital because it prevents the ships from being placed out of bounds.

All data above is processed in the function and what's returned is an array of valid positions for the current ship being placed.

#### The **Algo**

For the sake of brevity, I will only cover a **couple** of snippets that, may or may not be, infinitesimally complex to an intermediate level of developer.

##### 1. **`extractAxisArray` Logic For Vertically Oriented Ships

This logic traverses the provided gameboard. 
Since it is implemented in the form of a 2D array, we can do so iteratively by its rows (`horizontal`) and columns (`vertical`). The logic for vertical traversal is minutely more complicated than its horizontal counterpart:

``` javascript
// Populate `axisArray` with column data

// Original: 
for (let i = 0; i < boardSize; i++) {
  const columnValue = gameboard[i][axisIndex];
  axisArray.push(columnValue);
}

// Refactored (for readability):
gameboard.forEach(row => {
  const columnValue = row[axisIndex];
  axisArray.push(columnValue);
});

// Further refactored (for simplification):
gameboard.map(row => row[axisIndex])
```

Traversing our rows is straightforward (_literally_). All items of the same row are stored contiguously (within the _same_ array). Therefore, in determining the states of horizontal positions, all we need to do is use the provided `axisIndex` to access the specific row of the 2D array under test. 

Traversing our columns? Not so simple. In order to access all items of a requested column, we need to extract the values from each row in the 2D array at `axisIndex`. It requires accessing a non-contiguous memory location. 

The original logic used a traditional `for loop` to access each row, and extract each value at the `axisIndex`.

The `forEach` logic:
1. Initialized `axisArray` as an empty array.
2. Used `boardSize` to iteratively access the rows via the `forEach` method.
3. Pushed the value at `axisIndex` of each row to `axisArray`.

This method _preserves the order of the columns values_ while _enabling us to store them contiguously_. This is the recipe that allows us to use the same methods that we use to process a row, for our column.

**⚠️ Note:** We are only able to use `boardSize` in our loop because the gameboard is a square. The size of the rows and columns are the same, so `axisArray` will always be a fixed length. 

In the _further_ refactored logic that uses `map`, we achieve the same functionality in one line. `map` here creates a new array from our gameboard that transforms each row array into the value of each row array at the `axisIndex`. Thus returning a new array of all values of a single column.

##### 2. **`findValidPositionsInAxis`**:

This function identifies valid positions for placing a ship on the gameboard, based on its size and orientation.

``` javascript
let streak: number = 0;
let validShipPositions: Position[] = [];

for (let i = 0; i < boardSize; i++) {
  if (axisArray[i] === VACANT) {
    streak++;

    if (streak >= gamePieceSize) {
      const bowPosition =
        direction === 'horizontal'
          ? [axisIndex, i - (gamePieceSize - 1)]
          : [i - (gamePieceSize - 1), axisIndex];
      const sternPosition =
        direction === 'horizontal' ? [axisIndex, i] :[i, axisIndex];

      validAxisPositions.push({
        bow: bowPosition,
        stern: sternPosition,
      });
    }
  } else if (axisArray[i] === OCCUPIED) {
    streak = 0;
  }
}
```

---

**✨ Side Note:**

When structuring code, I tend to, at this time of writing:

* Place utility functions in a globally scoped directory (`src` folder). 

* Nest helper functions within the directory of the module they assist, inside a `helpers` directory. 

* Use function expressions within function declarations to assign parts of a function to variables. This enhances readability and effectively creates logical separations to indicate that the separated logic is a "mini-helper". 

---

###### Function Dependencies:

When `getValidPositions` is called, its dependencies (`direction` & `gamePieceSize`) are already provided via the outer functions parameters.

**Variable Initialization:**

Within the "mini-helper"::

  * `streak`: Tracks the number of consecutive `VACANT` positions in the specified row or column.
  * `validShipPositions`: An array to hold valid ship positions conforming to the `IPosition` interface specification.

**Logic Explanation:**  

The function iterates over `axisArray` once, checking each value:

  * If the position is `VACANT`, increment `streak`.
  * If the position is `OCCUPIED`, reset `streak`.

The `streak` helps determine if a sufficient number of consecutive `VACANT` positions are available for the ships placement.

When `streak` is greater than or equal to `gamePieceSize`, it indicates that the current position is valid for the `stern` of the ship. The `bow` can be placed in the preceding `VACANT` spaces.

**Design Decision:**

I _could have_ fine-tuned the logic to make ship direction `gameboard`-dependent, where ally and enemy ships face each other; However, I implemented a simple ship UI design where the bow and stern are indistinguishable. Therefore, I chose not to complicate the code design.

**Variable Naming**

Consider the variable names purely informative. `endOne` and `endTwo` weren't sufficient enough for my taste. `bow` and `stern` provide enhanced readability and clarity, making the code more intuitive.   

###### Quick Walkthrough:

Given:

* A 'Destroyer' ship (`gamePieceSize` of 3) with a `horizontal` orientation.
* `axisIndex` of 3.

Assume the rows content is:

``` javascript
[V, V, V, O, O, V, V, V, V]
```

During the third iteration where `i === 2` and `streak === 3`, `streak >= gamePieceSize`, thus, we have our first valid position in the row in our ship where:

  * `bowPosition` is stored as `[axisIndex, i]`. This corresponds to `[3, 2]`.
  * `sternPosition` is stored as `[axisIndex, i - (gamepieceSize - 1)]`. Plugging in our values we get `[3, 2 - (3 - 1)]`. Simplifying this further, we get `[3, 0]`.

Both of these values are stored in an object representing a valid position, and it is pushed to the `validShipPositions` array.

After resetting the streak and iterating further, other valid positions are identified and added to `validShipPositions`.

The final array is:

``` javascript
[
  { bow: [3, 2], stern: [3, 0] },
  { bow: [3, 7], stern: [3, 5] }, 
  { bow: [3, 8], stern: [3, 6] } 
]
```

This array, returned at the end of the function call, represents valid positions for placing the 'Destroyer' ship. The logic applies similarly to columns for vertically oriented ships.
