class ParsingError extends Error {
  constructor(
    message: string,
    notation: string,
    token: string,
    position: number
  ) {
    super(
      `${message}: ${token} at position ${position}\n` +
        `${notation}\n` +
        ' '.repeat(position - 1 - token.length) +
        '^'
    );
  }
}
export default ParsingError;
