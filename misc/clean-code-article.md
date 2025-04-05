# Clean Code in Action: Building an Elegant Ship Rotation System

## Introduction

In game development, even seemingly simple mechanics like rotating a ship in Battleship can present complex challenges. This article explores how clean code principles can transform a complex rotation system into an elegant, maintainable solution.

## The Problem: Ship Rotation in Battleship

Rotating a ship in Battleship involves more than just changing its orientation. We need to:
- Track current and potential positions
- Validate new positions
- Handle edge cases
- Maintain game state
- Ensure smooth transitions

## Design Decisions

### 1. State Management
```typescript
interface RotationalPivotConfigurations {
  transientAngleOfRotation: AngleOfRotation;
  coordinatesArray: Coordinates[];
  orientation: Orientation;
}
```
Using a transient state allows us to:
- Track current rotation without committing changes
- Validate positions before applying them
- Maintain clean separation between current and potential states

### 2. Position Mapping
```typescript
type RotationalPositionMap = Map<AngleOfRotation, IPlacePieceParams>;
```
This structure:
- Maps angles to valid positions
- Provides efficient lookup
- Maintains type safety

## The Solution: A Clean Implementation

### 1. Core Rotation Logic
```typescript
public rotatePiece(ship: BattleshipBuilder): void {
  // Helper functions for clean, focused operations
  const getNextAngle = (/* ... */) => { /* ... */ };
  const getMaxAngle = (/* ... */) => { /* ... */ };
  const getNextPiecePlacementParams = (/* ... */) => { /* ... */ };
  
  // Main rotation logic
  const finalPlacePieceParams = updateTransientPlacementParams(rotationalPositionMap);
  
  // Validation and application
  if (ship.rotationalPivotConfigurations.transientAngleOfRotation === initialAngle) {
    console.warn('No valid rotational position found.');
    return;
  }
  
  this.relocateShip(ship, finalPlacePieceParams, false);
}
```

### 2. Clean Code Principles in Action

#### Single Responsibility Principle
Each helper function has one clear purpose:
- `getNextAngle`: Finds the next valid rotation angle
- `getMaxAngle`: Determines rotation limits
- `getNextPiecePlacementParams`: Calculates new position parameters

#### Clear Naming
```typescript
// Semantic naming that tells a story
const finalPlacePieceParams = updateTransientPlacementParams(rotationalPositionMap);
```

#### Error Handling
```typescript
if (currentAngle === null || currentAngle === undefined)
  throw new Error("Current angle doesn't exist");
```

#### Type Safety
```typescript
interface IPlacePieceWrapperParams {
  ship: BattleshipBuilder;
  coordinates: Coordinates;
  orientation: Orientation;
}
```

## Key Clean Code Lessons

1. **Break Down Complexity**
   - Divide complex operations into focused helper functions
   - Each function should have a single, clear purpose

2. **Use Semantic Naming**
   - Names should tell a story
   - Variables should reflect their purpose
   - Types should be descriptive

3. **Handle Edge Cases Gracefully**
   - Validate inputs
   - Provide clear error messages
   - Handle invalid states

4. **Maintain State Cleanly**
   - Use transient states for temporary operations
   - Clear separation between current and potential states
   - Proper state validation

5. **Write for Readability**
   - Clear function organization
   - Logical flow of operations
   - Helpful comments where needed

## Potential Improvements

1. **Modularization**
   - Extract rotation logic into a separate class
   - Create a dedicated rotation service

2. **Testing**
   - Add unit tests for rotation logic
   - Test edge cases and invalid states

3. **Visualization**
   - Add rotation preview
   - Show valid rotation paths

## Conclusion

Clean code isn't just about making code look pretty—it's about creating maintainable, understandable solutions to complex problems. The ship rotation system demonstrates how clean code principles can transform a challenging problem into an elegant solution.

By focusing on:
- Clear separation of concerns
- Semantic naming
- Proper state management
- Robust error handling
- Type safety

We can create code that's not just functional, but a pleasure to work with and maintain.