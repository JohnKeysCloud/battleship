
### 10/15/24
If I want to keep the game playable in the terminal, with the boards already randomized, I can:

1. Have the user input coordinates of the ship they wish to place 
2. Check those coordinates against the occupied positions on the gameboard
3. Return the ship that occupies that position. 

From there I can retrieve from the user, the set of coordinates at which the user wants to place the bow of the ship and in what orientation. This would either be successful or face rejection depending on the configurations they select. 

For the UI, the user would be hovering over the gameboard and if they click a ship, it will reorient (if possible). If they click and drag, the ship will move, and only be placed if hovering over a coordinate for the bow that allows the space for the rest of the ship to reside.

What is the common core logic?

### 10/26/24 - Piece Rotation Thoughts & Spaghetti Implementation

// 💭 Some ground rules
// i will need to remove the ship without changing the initial value
// place it at 90 degrees from original (if possible)
// if not, place it at 180 degrees
// if not, place it at 270 degrees
// if not, blink red to signify that it can't be rotated.
// if it can only fit in one of the 3 different orientations, running this function should have the position alternate between the 2 states.

// 💭 Some logic (will require bound & coordinate occupation checks)

// > 90 degree rotation from og position - horizontal
// ! Same coordinates, different orientation 🚬

// > 180 rotation from og position - horizontal
// ! Shift bow placement of `x - shipLength - 1`
// ! Old bow coordinates becomes new stern coordinates

// 🟢 ship.length === 3 | [x,y] => [4,0], [5,0], [6,0]
// ? before:
// [x,x,x,x,o,o,o,x,x,x]
// ? after:
// [x,x,o,o,o,x,x,x,x,x]
// * New x value (left shift) 2 units for bow coordinates (ship length - 1)
// * old bow becomes new stern

// 🟢 ship length === 5 | [x,y] => [2,0], [3,0], [4,0], [5,0], [6,0]
// ? before:
// [x,x,o,o,o,o,o,x,x,x]
// * Out of bounds

// 🟢 ship length === 5 | [x,y] => [5,0], [6,0], [7,0], [8,0], [9,0]
// ? before:
// [x,x,x,x,x,o,o,o,o,o]
// ? after:
// [x,o,o,o,o,o,x,x,x,x]
// * New x value (left shift) 4 units for bow coordinates (ship length - 1)

// > 270 rotation from og position - horizontal
// ! New bow coordinates requires old bow/new stern `y - shipLength - 1`
// ! New stern coordinates becomes old stern coordinates
// ! New bow coo


// 🟢 ship.length === 4
// ? before: (bow at [4,5] represented by "+" | stern at [7,5] represented by "~" )
// row-5: [x,x,x,+,o,o,~,x,x,x]
// ? after:
// column-4: [
//            x,
//            x,
//            +,  // [4,2] new stern (new stern/old bow Y value - ship length - 1) 
//            o,  
//            o,  
//            ~,  // [4,5] (Old bow coordinates)
//            x,
//            o,
//            o,
//            o,  
//           ]
// * New stern becomes old bow, and new bow coordinates are old bow/new stern Y-value - ship length - 1

    // horizontal 90 && vertical 270
    // have the same logic
    
    // horizontal 180 && vertical 180
    // has same orientation

    // horizontal/vertical 90 && horizontal/vertical 270
    // have different orientation

    // horizontal 270 && vertical 180 
    // have same calculation on same coordinate

``` typescript
const rotatedPiecePlacementParamsSpaghetti = {
  90: {
    bowCoordinates:
      isHorizontal
        ? rotationalPivotBowCoordinates 
        : rotationalPivotBowCoordinates.map(
          (coordinate, index) =>
            index === 0 
              ? applyOffsetToCoordinate(coordinate) 
              : coordinate 
        ),
    orientation:
      isHorizontal
        ? 'vertical'
        : 'horizontal'
  },
  180: {
    bowCoordinates:
      isHorizontal
        ? rotationalPivotBowCoordinates.map(
          (coordinate, index) =>
            index === 0
              ? applyOffsetToCoordinate(coordinate)
              : coordinate
          )
        : rotationalPivotBowCoordinates.map(
          (coordinate, index) =>
            index === 1
              ? applyOffsetToCoordinate(coordinate)
              : coordinate
          ),
    orientation:
      isHorizontal
        ? 'horizontal'
        : 'vertical'
  },
  270: {
    bowCoordinates:
      isHorizontal
        ? rotationalPivotBowCoordinates.map(
          (coordinate, index) =>
            index === 1
              ? applyOffsetToCoordinate(coordinate)
              : coordinate
        )
        : rotationalPivotBowCoordinates,
    orientation:
      isHorizontal
        ? 'vertical'
        : 'horizontal'
  }
}
console.log(rotatedPiecePlacementParamsSpaghetti);
```

```typescript

// before:
if (
  (RotationOrNull === 180 && !isHorizontal) ||
  (RotationOrNull === 270 && isHorizontal)
) {
  return [x, applyOffsetToCoordinate(y)]
} else {
  return [applyOffsetToCoordinate(x), y]
}


// patterns:

// No coordinate change (90 degrees when horizontal, or 270 degrees when vertical)
// Offset y coordinate only (180 degrees when vertical, or 270 degrees when horizontal)
// Offset x coordinate only (180 degrees when horizontal)

// isHorizontal === true
// RotationOrNull = 180 -> offset applied to x
// RotationOrNull = 270 -> offset applied to y

// isHorizontal === false
// RotationOrNull = 90 -> offset applied to x
// RotationOrNull = 180 -> offset applied to y

// if horizontal and degree of rotation === 180 the x coordinate is offseat
// if horizontal and degree of rotation === 270 the y coordinate is offset

// if !horizontal and degree of rotation === 180 the y coordinate is offset
// if !horizontal and degree of rotation === 90 the x coordinate is offset

// after:

const offsetCoordinate = isHorizontal ? applyOffsetToCoordinate(x) : applyOffsetToCoordinate(y);

return isHorizontal
  ? RotationOrNull === 180
    ? [offsetCoordinate, y]
    : [x, offsetCoordinate]
  : RotationOrNull === 180
    ? [x, offsetCoordinate]
    : [offsetCoordinate, y];
```

### 10/29/24 Part 1

Placing a piece retrieves valid rotated positions and stores them on the ship.
if a ship is moved, it is removed then placed again:
  - therefore, removing a ship should nullify the valid rotated positions property before being reassigned in place piece.

if a ship is rotated, it is removed then placed again. 
  - therefore, when removing the ship, this time around, i should NOT reset the property

finally, place piece should only set the valid rotated property if one does not currently exist on it  

### 11/7/24 Rotational valid position check

`isPositionValid` in `rotatePiece`

`isHorizontal`

`90` deg 
same bow -> `[x, y + 1]`
Initializer:  `i = 1`
Condition: `ship.length - 1`
Test: `[x, y + i]`

`180` deg 
new stern is old bow, 
new bow is `[oldSternX - ship.length - 1, y]`
Initializer: `i = 0 `
Condition: `i < ship.length - 2`
Test: `[x + i, y]`

`270` deg
new stern is old bow 
new bow is `[x, oldSternY - ship.length - 1]`
Initializer: `i = 0`
Condition: `i < ship.length - 2`
Test: `[x, y + i]`

`!isHorizontal` // vertical

`90` deg
new stern is old bow
new bow is `[oldSternX - ship.length -1, y]`
Initializer: `i = 0`
Condition: `i < ship.length - 2`
Test: `[x + i, y]`

`180` deg
new stern is old bow
new bow is `[x, oldSternY - ship.length - 1]`
Initializer: `i = 0`
Condition: `i < ship.length - 2`
Test: `[x, y + i]`

`270` deg
same bow -> `[x + 1, y]`
Initializer: `i = 1`
Condition: `i < ship.length - 1`
Test:  `[x + i, y]`

### 1/27/25 Functional Programming
``` typescript
// Utility function to create a board of given size filled with zeros
const createBoard = (size) => Array.from({ length: size }, () => Array(size).fill(0));

// Utility function to update a cell's value
const updateCell = (board, row, col, value) => 
  board.map((r, i) =>
    r.map((cell, j) => (i === row && j === col ? value : cell))
  );

// Utility function to retrieve a cell's value
const getCell = (board, row, col) => board[row][col];

// Example usage
const boardSize = 10;
let board = createBoard(boardSize);

console.log("Initial Board:");
console.table(board);

board = updateCell(board, 1, 2, 42);
console.log("Board after updating cell (1, 2) to 42:");
console.table(board);

const value = getCell(board, 1, 2);
console.log(`Value at cell (1, 2): ${value}`);
```

### 2/1/25 `readyUp()` (...and beyond) Roadmap

#### Iteration 1
1. This component needs to lock the gameboard
  a. On fleet lock, stop animation and remove event listeners.

2. Move to next phase of game
  a. On fleet lock, show either "finding an opponent" or, if
     playing a bot show a shuffler animation that 
     randomize who will go first and show user an animation of 
     the shuffler (finding an opponent will lead to the same 
     animation). Make it last precisely 3 seconds. 
     If opponent goes first, leave position of gameboards in UI
     If player goes first, move player gameboard down as 
     opponent gameboard moves up [use translate 3d combined with 
     precise opacity transitions with z-index swap to make        
     opponent board click-able ( on attack)].
     
 b. Create the above mentioned 'opponent turn' UI state and 
    depending on turn state, toggle between the two with a 
    smooth animation (i,e, player to opponent turn and vice
    vice versa).

#### Iteration 2
Methods of public `readyUp()` method which will call other methods
private methods such as:
 1. `lockGameBoard()`;
 2. `randomizeTurnState()`;
 3. `animateTurnState()`; 
   a. If player goes first, animate to: `playerTurnState: 'player'`;
    Initial state is opponent turn state, so no animation needed if
    opponent goes first.
 4. Attach listeners to opponent gameboard
   a. Toggle board pointer events (key in `bellumState`). This toggle 
      will remove/add the classes to the gameboard elements that move 
      active board up and down (or however I decided to animate it).

 If opponent goes first, show "Your `opp(osition)` is preparing  
 to fire...". This animation should show for `x` seconds if playing a 
 bot or until the opposition makes a selection of a grid to attack.

 This will be in the `bellum` fragment of the main container one hot 
 swap container.

 After selection is made (or 3 seconds have passed), the gameboard
 UI will update to reflect the attack [dot if empty grid cell or 
 add `cooked` class to ship unit that was hit (and increment its hit counter)].

Toggle event listeners depending on the turn state.
Animate ship opacity to 0 if fully cooked (sunk):
``` typescript
interface GameState {
 playerTurnState: 'null' | 'player' |'opponent'; // null initially
 gamePhase: 'parabellum' | 'bellum' | 'postBellum', // `parabellum` initially
 . . .
}
```

 **Note:** Some of the above is out of scope for this component, such as
 gameboard updates and animations. This component will only handle
 the locking of the gameboard and the transition to the next phase of the game.

