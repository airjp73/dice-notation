export interface DiceRule<T> {
  regex: RegExp;
  typeConstant: string | Symbol;
  tokenize: (raw: string) => T;
  calculateValue: (token: T) => RollResult;
}

export interface RollResult {
  result: number;
  rolls: number[];
}
