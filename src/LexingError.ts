import { Token } from './tokens';

class LexingError extends Error {
  constructor(message: string, token: Token) {
    super(`${message}: ${token.content} at position ${token.position}`);
  }
}

export default LexingError;
