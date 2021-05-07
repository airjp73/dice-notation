# @airjp73/dice-notation

A flexible and pluggable js library for parsing dice notation. It has:

- Fully typed with Typescript
- No-fuss use for simple use-cases
- High level of customization
- Ability to inspect the individual tokens in the notation -- not just calculate the result.

## Installation

```
npm install --save @airjp73/dice-notation
```

## Simple Usage

If all you want to do is parse some dice notation and get the result you can import `roll` and pass in the notation.

```js
import { roll } from '@airjp73/dice-notation';

const { result } = roll('1d6 + 3');
```

It is recommended to use an IDE or text editor that can show you the Typescript types for more in-depth documentation.

## Inspecting individual rolls

If you want to get the results of individual dice rolls or more info about the notation itself, you can use these functions.
The `roll` function from the Simple Usage section is essentially just a wrapper for these 4 functions.

```js
import {
  tokenize,
  rollDice,
  tallyRolls,
  calculateFinalResult,
} from '@airjp73/dice-notation';

// Gets the tokens from the lexer
// Example: [DiceRollToken, OperatorToken, DiceRollToken]
const tokens = tokenize('2d6 + 3d4');

// Rolls any dice roll tokens and returns all the individual rolls.
// rolls[i] contains all the rolls for the DiceRollToken at tokens[i]
// Example: [[3, 1], null, [1, 3, 2]]
const rolls = rollDice(tokens);

// Takes the rolls and totals them
// Example: [4, null, 6]
const rollTotals = tallyRolls(tokens, rolls);

// Get the final result of the roll
// Example: 10
const result = calculateFinalResult(tokens, rollTotals);
```

It's broken up this way to allow as much flexibility as possible for how you want to display the information and what kind of custom dice rules you might want.

## Custom dice rules

The default `roll` function only supports basic dice notation. If you want to support something more than that, you need a custom dice rule.

### Custom dice rule implementation

Let's say we want to add a rule to allow us to use `d%` instead of `d100`. We can create our rule like this:

```js
// A convenience function for rolling a dice. You can use something else if you want
const myRule = {
  // Regex to pass to the parser
  regex: /\d+d%/,

  // A unique string for our token
  typeConstant: 'MyRule',

  // Takes the raw string value of the custom dice roll
  // and returns data about that role -- it can be whatever you want it to be
  // in this case we only care about how many d100s we need to roll
  tokenize: (raw) => ({ numDice: parseInt(raw.split('d')[0]) }),

  // Takes the data returned from `tokenize` and returns an array of rolls
  // this is so we can see what every individual dice roll was if we want
  // Here we're using a helper to auto-generate the rolls (see helper section below)
  roll: ({ numDice }, { generateRolls }) => generateRolls(numDice, 100),

  // Takes the token returned from `tokenize` and the rolls returned from `roll`
  // and returns the total value
  // Here we're just summing all the rolls, but you can do special logic here if you want
  calculateValue: (token, rolls) => rolls.reduce((agg, num) => agg + num, 0),
};
```

### Type definition

The full type definition of a custom rule is:

```ts
interface DiceRule<T> {
  regex: RegExp;
  typeConstant: string;
  tokenize: (raw: string, config: RollConfig) => T;
  roll: (token: T, config: RollConfig) => Rolls;
  calculateValue: (token: T, rolls: number[], config: RollConfig) => number;
}
```

### RollConfig helpers

As you can see above, there are some useful helpers given to each part of the dice rule.

```ts
export interface RollConfig {
  // Generate a random number between `min` and `max` inclusive
  // `random(1, 6)` would be like rolling 1d6 because it would generate a number between 1 & 6
  random: (min: number, max: number) => number;

  // Generates `numDice` rolls for dice of size `diceSize`
  // `generateRolls(3, 6)` would be like rolling 3d6
  generateRolls: (numDice: number, diceSize: number) => number[];

  // An object that contains any context provided by you
  // See configuration section below
  context: Record<string, any>;
}
```

### Using the custom rule

Once you've created your custom rule, you need to create new roll methods like so:

```js
import { withPlugins, createDiceRoller } from '@airjp73/dice-notation';

// You can use the same roll functions as before, but now your custom rules are injected into it.
const {
  roll,
  tokenize,
  rollDice,
  tallyRolls,
  calculateFinalResult,
} = createDiceRoller(withPlugins(myRule));
```

## Configuration

Configuration options can be provided to `createDiceRoller` and/or to individual rolling functions.

```ts
// Configuration when creating dice roller
createDiceRoller(withPlugins(myRule), config);

// Configuration when rolling
roll('1d6', config);
const tokens = tokenize('1d6', config);
const rolls = rollDice(tokens, config);
const rollTotals = tallyRolls(tokens, rolls, config);

// `calculateFinalResult` does not accept configuration
const result = calculateFinalResult(tokens, rollTotals);
```

### Configuration options

#### `random`

Can be used to customize the randomization function used by dice rules.

```ts
const config = {
  // Contrived `random` function that returns `min` + `max` instead of a random number
  random: (min, max) => min + max,
};

// The result here will be `7`
roll('1d6', config);
```

#### `context`

Used to provide outside context to custom dice rules.

Example: This could allow you to write a custom rule to allow variables in dice notation.
The values for each variable can be provided through `context`

```ts
const config = {
  context: {
    myVariable: 5,
  },
};

// Result will be `1d6 + 5`
roll('1d6 + myVariable', config);
```

#### `maxRandomRolls`

By default, the dice roller will throw an error if it rolls more than 100,000 dice.
Rolling too many dice can result in browser or server crashes, so it's not recommended to tweak this setting.
This setting is not intended as validation, simply as crash-prevention.

If 100,000 is too few dice, this can be changed with this setting:

```ts
const config = {
  maxRandomRolls: 1_000_000,
};
```

If you _really_ want to disable the limit entirely (this is probably a bad idea),
you can turn it off like this:

```ts
const config = {
  maxRandomRolls: 'unlimited_rolls_not_recommended',
};
```
