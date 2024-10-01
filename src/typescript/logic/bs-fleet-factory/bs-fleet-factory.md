## `bs-fleet-factory.ts`

### `class BattleshipFleetFactory`

#### `private fleet: Fleet`

A private property in the class that conforms to the `Fleet` type, which, as previously discussed, is an object where the keys are specific ship types (e.g., 'carrier', 'battleship') and the values are instances of the `BattleshipFactory` class.

##### Why is the property not in the constructor?

The `fleet` property is not directly assigned in the constructor because it is created dynamically based on the parameters passed to the constructor. This dynamic creation means the property does not need to be explicitly included as a parameter in the constructor.

##### Why is it `private`?

The `fleet` property is marked as `private` to encapsulate and protect the internal state of the `BattleshipFleetFactory` class. Making `fleet` private ensures that it can only be accessed or modified from within the class, preventing external code from directly altering the fleet's data. This design pattern helps maintain the integrity of the fleet by controlling access through specific methods like `getShip` or via a `get` accessor.

#### `private constructor(fleet: Fleet)` Constructor

The `private` keyword in the constructor of a class means that instances of the class cannot be created directly from outside the class using the `new` keyword. Instead, the class must provide static methods or properties to control how instances are created.

**Why Use a Private Constructor?**

1. **Controlled Instantiation**:
   - By making the constructor private, the class ensures that it cannot be instantiated directly by users of the class. This allows for strict control over how instances are created.

2. **Design Pattern Implementation**:
   - This design is useful for implementing certain design patterns, such as the Factory pattern. In the case of the `BattleshipFleetFactory`, only predefined static methods (`createHasbroFleet` and `createMBFleet`) are used to create instances. These methods enforce specific rules or configurations for fleet creation.

3. **Encapsulation**:
   - The private constructor encapsulates the instantiation logic and state management within the class. It prevents the creation of instances with invalid or inconsistent state, ensuring that all instances adhere to the expected configuration.

4. **Abstraction of Fleet Creation**:
   - For the Battleship game, where there are predefined fleet compositions, the private constructor abstracts the complexity of fleet creation. Users interact with the class through static methods, which handle the instantiation details and ensure that only valid fleets are created according to the game’s rules.

In summary, the private constructor in `BattleshipFleetFactory` is used to enforce controlled and consistent instantiation through static methods, aligning with the specific requirements of the Battleship game.

#### `private static createFleet` Method

##### Why it private?

Since it is a utility function that helps to generate a `Fleet` based on provided configurations. It's a helper method that doesn't depend on the instances state, it does not need access to instance-specific data. Making it static allows it to be called without needing to create an instance. 

##### `createFleet` Parameter Explained

``` typescript
// Initial Paramater (Pre-refactor)
shipConfigs: { [key in ShipType]?: { type: ShipType; version?: Version } }

// Refactored with `type` creation
type ShipConfig = {
  type: ShipType;
  version?: Version;
};

type ShipConfigs = {
  [key in ShipType]?: ShipConfig;
};

// New Parameter (Post-refactor)
shipConfiigs: ShipConfigs
```

This method accepts an object `shipConfigs` where:

- **Keys**: Must be one of the values defined in `ShipType` (e.g., `'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'cruiser' | 'patrolBoat'`).
- **Values**: Each value is an object with:
  - A required `type` property of type `ShipType`.
  - An optional `version` property of type `Version` (e.g., `1990 | 2002`).

The use of optional properties means that not all ship types need to be included.

##### Logic

``` typescript
const fleet: Fleet = {};

for (const [shipType, config] of Object.entries(shipConfigs)) {
  fleet[shipType] = new BattleshipFactory(
    config.type,
    config.version
  );
}

return fleet;
```

1. **Initialization**: `fleet` is initialized as an empty object conforming to the `Fleet` type.

2. **Destructuring with `Object.entries`**: Iterates over `shipConfigs`, extracting `shipType` (key) and `config` (value) pairs, allowing the `for...of` loop to process each entry.

3. **Populating `fleet`**: In each iteration, `shipType` is cast to `ShipType` and set as a key on `fleet`, with its value being a new `BattleshipFactory` instance created using the corresponding `config` values (`type` and `version`).

#### Static Methods: `createHasbroFleet()` and `createMBFleet()`

These static methods provide controlled ways to create instances of the class since the constructor is private and cannot be accessed directly. The `new` keyword is used internally within these methods, ensuring that instances are created according to the class's rules while preventing direct instantiation from outside the class.

Both methods return values that automatically conform to the `BattleshipFleetFactory` class since they instantiate the class directly. The primary difference between the methods lies in their ship configurations: Hasbro's (2002) fleet setup differs from Milton Bradley's (1990). The specific configuration differences are outside the scope of this documentation. Read the code, or read here: [Battleship Wikipedia](https://en.wikipedia.org/wiki/Battleship_(game))

#### Instance Methods

##### `getShip`

This method simply retrieves one of the ships of a fleet. It's parameter accepts a type of ship that conforms to an enumeration. This means that the carrier ship of a fleet is accessible via `ShipType.carrier`. 

Since the method must return an instance of the `BattleshipFactory`, it must ensure that the ship is defined, hence the conditional check. TypeScript's typing system would throw an error otherwise.

### `createFleets` Utility Function

It simply creates an object containing player one and player twos fleets depending on the version (i.e, Hasbro - 2002 and Milton Bradley - 1990). It accepts the version _year_ in its parameters.