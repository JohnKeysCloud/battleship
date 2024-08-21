## `ship.ts`

### `ShipOptions`

`ShipOptions` is an `interface` that defines the structure of a `Ship` object including its properties and methods related to its state.

#### Benefits of an Interface

1. **Clear Contract for Implementations:** The interface defines a clear contract that any implementing class must adhere to. This ensures consistency across different implementations. For example, if you were to create another class that implements `ShipOptions`, you are guaranteed that it will have the properties `length`, `hitCounter` and `seaworthy`.

2. **Type Safety:** TypeScripts interfaces provide type safety by ensuring that the properties and methods in your class adhere to the specified types. This prevents errors like assigning an incorrect type to a property.

3. **Reusability:** The `shipOptions` interface can be reused in other parts of your code. For instance, if you have a function that operates on objects with these properties, you can type the function to accept `ShipOptions`, making your code more modular and flexible.

For example:

``` typescript
function printShipStatus(ship: ShipOptions): void {
  console.log(`Ship Length: ${ship.length}`);
  console.log(`Hit Counter: ${ship.hitCounter}`);
  console.log(`Is Seaworthy: ${ship.seaworthy}`);
  console.log(`Position: (${ship.xPosition}, ${ship.yPosition})`);
}
```

Had I passed the Ship object without specifying the type in the function signature, there would be:

  * **No Type Checking:** Without the type annotation `ship: ShipOptions`, TypeScript won't check if the object being passed has the expected properties. This could lead to runtime errors if the object doesn't match the expected shape.

  * **Less Clarity:** The lack of an explicit type makes it harder to know what the function expects. This can lead to confusion, especially in a larger codebase.

4. **Ease of Refactoring:** If we ever need to change the properties or types associated with ships, we can do so in the interface, and TypeScript will flag any part of our code that does not conform to the new structure. This makes refactoring easier and safer.

5. **Documentation and Intellisense:** Using interfaces provides automatic documentation and better IntelliSense in code editors like VS Code. This helps us as developers understand what properties and types are expected when working with the `ShipFactory` class or any other class that implements `ShipOptions`.

6. **Separation of Concerns:** By separating the structure (`ShipOptions`) from the behavior (methods of `ShipFactory` instances), we maintain a clear distinction between what a ship "is" and what a ship "does." This separation can lead to cleaner and more maintainable code. 

7. **Default Values in Constructor:** In our `ShipFactory` class, we have default values for `hitCounter` and `seaworthy` in the constructor. This simplifies object creation, as we don't need to specify all values when creating an instance. The interface helps ensure that even with default values, the structure remains consistent.

8. **Error Handling in Constructor:** The interface ensures that any class implementing it will respect the required types and properties. The constructor logic in `ShipFactory`, like throwing an error if `length <= 0`, provides additional safeguards during object instantiation, ensuring no invalid ship objects are created. 

### `ShipFactory`
`ShipFactory` implements the `ShipOptions` interface and provides the actual logic for how the ship’s state changes, such as updating hits, checking if it's sunk, and any other behavior associated with the ship.

#### `public`

In TypeScript, when you define a class that implements an interface, you typically need to explicitly declare the properties of the class before you can use them in the constructor or elsewhere.

Take, for example this simplified, **incorrect** implementation:

``` typescript
class ShipFactory implements Ship {
  constructor(length: number, hitCounter: number, seaworthy: boolean) {
    this.length = length;
    this.hitCounter = hitCounter;
    this.seaworthy = seaworthy;
  }
}
```

This code is _attempting_ to assign values to `this.length`, `this.hitCounter`, and `this.seaworthy`, but these properties haven't been declared in the class. TypeScript expects you to explicitly declare these properties within the class before using them.

Here is one fix:

``` typescript
class ShipFactory implements Ship {
  length: number;
  hitCounter: number;
  seaworthy: boolean;

  constructor(length: number, hitCounter: number, seaworthy: boolean) {
    this.length = length;
    this.hitCounter = hitCounter;
    this.seaworthy = seaworthy;
  }
}
```

Now, the properties are properly declared and they can be used and assigned values within the constructor. 

While this implementation is correct, there is a more precise way to achieve the same result in TypeScript by using the `public` keyword in the constructor parameters. 

When you prefix constructor parameters with `public` (or `private` or `protected`), TypeScript automatically creates corresponding class properties and initializes them with the values passed to the constructor.

This eliminates the need to manually declare the properties at the top of the class and then assign them in the constructor. 

Using the `public`, `private`, or `protected` prefixes in constructor parameters is considered best practice in TypeScript when you want to quickly declare and initialize class properties, as it makes the code more efficient and concise.

Here is the refactored version:

``` typescript
class ShipFactory implements Ship {
  constructor(
    public length: number,
    public hitCounter: number,
    public seaworthy: boolean = true;
  ) {
    // No additional logic needed, so the constructor body can be empty
    // More Information below!
  }
}
```

#### The Constructor Body

Inside the curly braces `{}` of a class constructor, you generally find the logic that initializes the class, sets up initial state, or performs any other operations that are necessary when creating an instance of the class. 

Such operations include:
  * **Initializing properties:** Setting up properties that might depend on some initial logic or calculations.
  * **Validation:** Checking if the arguments passed to the constructor meet certain criteria.
  * **Event Listeners:** Setting up necessary event listeners or other callbacks.
  * **Method calls:** Triggering certain methods to initialize state or set up necessary data.

In our `ShipFactory`'s constructor body we have safe guards that ensure our instances have valid properties:

  * `if (length <= 0) { throw new Error('Ship length must be greater than zero'); }`:
    - **No `this.` Prefix:** This condition checks the length parameter passed to the constructor to ensure it is valid before assigning it to the class property. The absence of this. indicates that we are validating the parameter, not the instance property.

  * `this.hitCounter = Math.max(0, hitCounter);`
   - **Using `this.` Prefix:** This line assigns a safe, non-negative value to the `hitCounter` class property. The `this.` prefix is used here because we are setting the property of the class instance, ensuring that the property value is appropriately adjusted.