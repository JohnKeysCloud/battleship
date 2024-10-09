## `place-piece.ts`

This function contains the logic that places a ship on the gameboard. It is a _callback_ wrapped by a method on the gameboard class. 

### The Meat & Potatoes - `placeShip`

#### Parameters

What information is required in order to place a ship on a Battleship gameboard? 

1. Obviously we will need the board we are placing the ship on (`gameBoardInstance`).

2. The ship being placed (which can have varying unit lengths) (`ship`).

3. The position on the board where we want to place our ship. This is represented by the `coordinates` of the ship's bow in the standard Cartesian coordinate system format with an inverted y-axis (i.e., `[x, y]`).

4. Finally, we need the `orientation` of the ship we are placing to determine where on the board the rest of the ship will be placed.

...Oh snap! would you look at that!? If only there were an interface that defined the shape for such an object that would contain the above properties!

Spoiler alert, it's `IPlacePieceCallbackParams`.

#### The **Algo**

First, the parameters that are required to perform imperative initial checks are stored in a more readable and manageable format. The `coordinates` array for example, is destructured for the sake of storing the `x` and `y` coordinates individually as `bowRow` and `bowColumn` to streamline further processing. 

The `orientation` of the ship determines which of the above destructured values is passed to the `checkIfCoordinatesInBounds` helper function. This value, along with the ship length, ensures that the passed coordinates are in the boards bounds _before_ running checks that are more labor intensive such as determining whether or not the position is actually valid for placement.

If this test passes, the actual potential position is calculated and stored (in compliance with the `IPosition` interface) before it is compared to the valid positions for current ships specified configurations via the `isPositionValid` helper function. Utilizing the shape of the return object from the `getValidPositions` method on the gameboard class, for example:

``` typescript
{
  'column-0': [
    { bow: [0, 0], stern: [2, 0] },
    { bow: [1, 0], stern: [3, 0] },
    { bow: [2, 0], stern: [4, 0] },
    { bow: [3, 0], stern: [5, 0] },
    { bow: [4, 0], stern: [6, 0] },
    { bow: [5, 0], stern: [7, 0] },
    { bow: [6, 0], stern: [8, 0] },
    { bow: [7, 0], stern: [9, 0] },
  ],
	// ...
}
```

…we need not traverse its entirety considering that we know which row or column would contain position; Hence, the logic for `isPositionValid` requires an `axisArrayKey` argument that enables a direct row/column check. 

If we aim to place a ship vertically with position `{ bow: [2, 0], stern: [4, 0] }`, we know that we can check `validPositions` at `column-0`. 
If we aim to place a ship horizontally with position `{ bow: [3, 2], stern [3, 5] }`, we know that we can check `validPositions` at `row-3`.

Hence, the logic for `isPositionValid`:

``` typescript
const validPositions = gameboardInstance.getValidPositions(shipConfigurations);
    
return validPositions[axisArrayKey].some((validPosition: IPosition) => 
  arePositionsEqual(position, validPosition));
```

Where first, the `validPositions` object is generated. Then, using the `axisArrayKey`, the row/column where our valid position is _potentially_ stored, is accessed directly. `<validPositionArray>.some(validPosition: IPosition => arePositionsEqual(position, validPosition))` returns true if any of the valid positions in the row/column has a position object that is identical to the position we aim to place the ship at. Otherwise, it returns false.

The boolean returned from this operation determines whether or not the `placeOnBoard` helper function is invoked.

`placeOnBoard` accepts the validated position object, the symbol of the ship to be placed, and the orientation of the ship where:

- **`primary`** stores the row or column number that remains constant when replacing the board's vacant symbols with those that represent the ship. 

For example, if we are placing a ship horizontally, the `x` value of either the bow or stern (`bow[0]` or `stern[0]`) would do for retrieving this constant. If we are placing the ship vertically, the `y` value of the bow or stern would suffice.

- **`axisStart`** stores the index of the row or column that the symbol replacement is to start from. This value is used as the _initializer_ of the `for` loop that directly accesses and mutates the gameboard.

- **`axisEnd`** stores the index of the row or column that the symbol replacement is to end at. This value is used in the _condition_ of the `for` loop, which determines when the loop ends in the symbol replacement process.
---

**✨ Side Note**:

Previously, `isPositionValid` checked each square individually, which resulted in unnecessary traversal of the entire grid. By refactoring the function to focus only on relevant rows or columns based on orientation, we reduced the computational load and improved efficiency. Here is that silly logic:

``` typescript
for (const axisArray in validPositions) {
  if (
    validPositions[axisArray].some((validPosition: IPosition) =>
      arePositionsEqual(position, validPosition)
    )
  ) {
    return true;
  }
}
```