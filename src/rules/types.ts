export interface Plugins {
  [key: string]: DiceRule<any>;
}

export interface DiceRule<T> {
  regex: RegExp;
  typeConstant: string;
  tokenize: (raw: string) => T;
  roll: (token: T, random: (min: number, max: number) => number) => Rolls;
  calculateValue: (token: T, rolls: number[]) => number;
}

export type Rolls = number[];

export type RollResults = (Rolls | null)[];
