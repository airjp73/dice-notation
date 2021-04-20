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

## Usage

If all you want to do is parse some dice notation and get the result you can import `roll` and pass in the notation.

```js
import { roll } from '@airjp73/dice-notation';

const { result } = roll('1d6 + 3');
```

It is recommended to use an IDE or text editor that can show you the Typescript types for more in-depth documentation.

## Inspecting tokens

If you want to get more data about the notation (like to do something more interactive with the ui), you can use the `tokenize` function.

```js
import { tokenize } from '@airjp73/dice-notation';

const tokens = tokenize('1d6 + 3');
```

## Custom dice rules

The default `roll` function only supports basic dice notation. If you want to support something more than that, you need a custom dice rule.

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
  tokenize: raw => ({ numDice: parseInt(raw.split('d')[0]) }),

  // Takes the data returned from `tokenize` and returns an array of rolls
  // this is so we can see what every individual dice roll was if we want
  roll: ({ numDice }, random) => {
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(random(1, 100));
    }
    return rolls;
  },

  // Takes the token returned from `tokenize` and the rolls returned from `roll`
  // and returns the total value
  // Here we're just summing all the rolls, but you can do special logic here if you want
  calculateValue: (token, rolls) => rolls.reduce((agg, num) => agg + num, 0),
};
```

The full type definition of a custom rule is:

```ts
interface DiceRule<T> {
  regex: RegExp;
  typeConstant: string;
  tokenize: (raw: string) => T;
  roll: (token: T) => Rolls;
  calculateValue: (token: T, rolls: number[]) => number;
}
```

Once you've created your custom rule, you need to create new roll methods like so:

```js
import { withPlugins } from '@airjp73/dice-notation';

// You can use `roll` the same as before, but now your custom rules are injected into it.
const { roll } = withPlugins(myRule);
```
