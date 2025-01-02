## `get-valid-ship-positions.ts`

This function identifies all valid positions for placing a game piece of a specified size on a game board, based on its orientation (horizontal or vertical). It verifies that the piece fits within the board's boundaries and that all required spaces are unoccupied. The function returns an array of positions where the piece can be placed without overlapping existing pieces or exceeding the board’s edges.

### The Meat & Potatoes - `getValidPositions`

#### Parameters

This function takes in vital information (in the form of a destructured object) to determine whether or not a particularly precise position is a valid for game-piece placement:

  * `shipLength`: The length of the ship. No shit. The amount of units on the gameboard that our piece will take up. Used to determine whether or not the piece would fit in all positions on the board.

  * `orientation`: This parameter is the orientation of the ship being placed. This will determine whether the algorithm checks rows or columns for potential valid positions.

  * `gameboardInstance`: This parameter expects the gameboard instance as its argument, as this function aims to _mutate_ the board with ship additions via `symbol` replacement. 
  
  In looping through the rows/columns of the gameboard:
    * Depending on the orientation,
    * The length of the ship,
    * and the information provided by the gameboard, we can know which positions of each index are available.
    
  The algorithm is able to determine whether or not there is space for the current ship being placed.

  The board size is extracted from the gameboard instance. Its size, 10, determines the constraints of the test condition in the algorithms `for` loops. This is vital because it prevents ships from being placed out of bounds.

All data above is processed and what's returned is a neat object containing all valid positions for the current ship being placed.

**✨ Side Note**:
> My first thought: "maybe I should add logic for ships with a length of `1`," as I've seen several implementations of the game with such ships. Before I fleshed out the logic, I referred back to the game's Wikipedia page, where I discovered that the smallest ship in Battleship has a length of `2` units! Work smarter, not harder my friends. It was a lot easier to make the following small change than to add the logic for a piece that can't exist! Rules. Without them, we might as well live with the animals. 💭

``` typescript
  // Validate piece length

  // Out with the old:
  if (shipLength <= 0) {
    throw new Error('Ship length must be greater than zero.');
  }

  // In with the new:
  if (shipLength < 2 || shipLength > 5) {
    throw new Error('Invalid piece length. Ship length must be between 2 and 5 units.');
  }
```

#### The **Algo**

For the sake of brevity, I will only cover a **couple** of snippets that, may or may not be, infinitesimally complex to an intermediate level of developer.

##### Brief Overview

1. Each row/column is iterated over via the `for loop`. `axisIndex` represents the index of the rows or columns of the gameboard. In each iteration:

  * **`extractAxisArray`**: Uses the `axisIndex`, `orientation` and `board`, to retrieve the current row or column array of the `board`.

  * **`findValidPostitionsInAxis`**: First, performs a relatively unnecessary check which throws an error if the given `shipLength` is longer than the current row/column length 😅.

  The `streak` helps determine if a sufficient number of consecutive vacant positions are available for the ships placement. It is incremented for each vacant position in the current row/column. When it's greater than or equal to `shipLength`, this indicates that the current position in the iterative process is valid for the `stern` of the ship. The rest of the ship can be placed in the preceding vacant spaces. This process occurs until the entire row/column is traversed.

  For each iteration where the streak is greater than or equal to the `shipLength`, a position object is created which stores the sets of coordinates where the bow and stern of the ship can be placed. 

  The `orientation` determines the order of the coordinates. For example, seeing as the board is represented by a 2D array using a Cartesian coordinate system with an inverted y-axis (or an inverted coordinate system) where the row can be seen as the _x-axis_ and the column as the _y-axis_, we can say that when traversing rows, that the `axisIndex` represents the _x-axis_ value. Otherwise, it represents the _y-axis's_ value (column). Therefore, in row traversal the _x_ values will be constant in both the bow and stern coordinates while in column traversals, the `y` values will be constant. 

  The _x_ and _y_ coordinates _not_ determined by the `axisIndex` leverage the row/column traversal's iterative process in conjunction with the `shipLength`. The current index of the row/column, when the `streak` is greater than or equal to ships length can be represented as the coordinate for the stern of the ship. Subtracting the ships length (minus 1) returns the index of the bows position.

  If the current index of the row/column is occupied, the streak is reset. If the subsequent position is vacant, the process begins again. It is repeated until the end of the row/column is reached. 

  * The valid positions of each row/column, objects, are pushed to individual arrays and stored in the `validPositionsPerAxis`. The key of each object within `validPositionsPerAxis` is a string that is formatted by the `axisTemplate`. It uses the `orientation` to determine whether the key strings are rows or columns and the `axisIndex` to label the number of each. 

**✨ Side Note**:

* On my design decision with how the `validPositionsPerAxis` object is organized, in my UI, I could have had ally and enemy ships face each other relative to the screen position of their respective boards, but I opted instead for a simple ship design where the bow and stern are indistinguishable. I mention this here to say that I _could have_ 😤.   

##### History of `extractAxisArray` Logic For Vertically Oriented Ships

This logic traverses the provided gameboard. 
Since it is implemented in the form of a 2D array, we can do so iteratively by its rows (`horizontal`) or columns (`vertical`). The logic for vertical traversal is minutely more complicated than its horizontal counterpart:

``` javascript
// Populate `axisArray` with column data
let axisArray = [];

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

Traversing our columns? Not as simple. In order to access all items of a requested column, we need to extract the values from each row in the 2D array at `axisIndex` in each row. This requires accessing a non-contiguous memory location. 

The original logic used a traditional `for loop` to access each row, and extract each value at the `axisIndex`.

The first time I refactored it, I replaced the loop with the `forEach` array method. This:
1. Used `boardSize` to iteratively access the rows via the `forEach` method.
2. Pushed the value at `axisIndex` of each row to `axisArray`.

In the final refactor, I use the built in `map` method. This achieves the same functionality as the above approaches in one, readable line. `map` here creates a new array from our gameboard that transforms each row array into the value of each row array at the `axisIndex`. Thus returning a new array of all values of a single column.

These methods _preserve the order of the columns values_ while _storing them contiguously_. This is the recipe that allows us to use the same methods that we use to process a row, for a column.

**⚠️ Note:** I was only able to use `boardSize` in the condition of the `for loop` because the gameboard is a square. The size of the rows and columns are the same, therefore `axisArray` is always a fixed length. The latter two approaches don't rely on the `boardSize` property at all. So, fuck yeah 😤.