import { DiceNotationTree } from './types';

class Lexer {
  notation: string;

  constructor(notation: string) {
    this.notation = notation;
  }

  lex(): DiceNotationTree {}
}

export function lex(notation: string) {
  return new Lexer(notation).lex();
}

export default Lexer;
