function random(min: number, max: number): number {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

export default random;
