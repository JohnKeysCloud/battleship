## `check-valid-placement.ts`

This function determines all valid positions for placing a game piece of a specified length on a gameboard, considering its orientation (horizontal or vertical). It checks if the piece would fit within the board's bounds and ensures that all required spaces for placement are vacant. The function returns an array of valid positions where the piece can be placed without overlapping occupied spaces or extending beyond the board's edges.

### `VACANT` & `OCCUPIED` Symbols

When pondering about what values I should fill my gameboard with I found myself in a bit of a pickle.

"I could use `null`" was my initial decision because it made sense syntactically and semantically, as the empty spaces on the board _can_ be described as 'representing the intentional absence of any object value'. Pretty much just fancier way of saying a placeholder.

Settled! Cool!

But now what shall become of these values once they are `OCCUPIED`? (8 bit of foreshadowing about my point).

'I could set it to `true`' was my initial thought. Syntactically it would make sense, as I could store the positions `true` value in an `isOccupied` variable to do with as I please. But, semantically, something about it not being descriptive enough. What _exactly_ is happening when the value is set to `true`? 

Wait, there's a thing called a `symbol`, whats that? 

...And _why_ am I writing expressively as a means of procrastination right now. I'll Google the first now, and figure out the latter later.

#### Whats a `Symbol` Yo?!

> Ok, I'm reverting back to a more technical writing style now. kThxBye 💭

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

##### Example in Context:
In my battleship gameboard implementation, I use `Symbol('VACANT')` and `Symbol('OCCUPIED')` to fill a 2D array. This approach ensures:
   - **No Collisions**: Other parts of the code won't mistakenly overwrite or interact with these values.
   - **Clear Intent**: It's clear what each `Symbol` represents, improving code readability.
   - **Efficient State Management**: I manage the state of the board in a lightweight, performance-friendly manner without the risk of confusing states or accidental changes.

By leveraging `Symbols`, I am taking advantage of their unique and immutable nature, enhancing the robustness and clarity of my code.

### The Meat & Potatoes - `checkValidPlacement`

#### Parameters

This function takes in vital information to determine whether or not a particularly precise position is a valid for game-piece placement:

  * `direction`: This parameter checks the orientation of the ship we wish to place. This will determine whether we check rows or columns for potential valid positions.

  * `axisIndex`: The row or column number in question. 
    - Depending on the orientation of the ship, we will need to either check empty spaces of the gameboard in rows, if the ship is horizontal, or in columns, if the ship is vertical. 

  * `gamePieceSize`: The amount of units on the gameboard that our piece takes up. To determine whether the piece would fit in the given row/column

---

> In my writing, at this very moment, I just had an epiphany. Maybe I should add logic for ships with a size of `1`, as I've seen several implementations of the game with such ships. Instead I referred back to the Wikipedia page for the game to discover that the smallest piece should have a size of `2`! Work smarter not harder my friends. Now, all I have to do refactor my `gamePieceSize` constraint checks. It's a lot easier to make this small change than to add the logic for a piece that won't exist! Rules. Without them, we might as well live with the animals. 💭

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

Now please give me one second, as I wish to commit this change… BRB ^_^ 💭

--- 










