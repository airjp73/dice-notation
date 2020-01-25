import random from '../random';

describe('random', () => {
  it('should return a random number between max and min', () => {
    const rollAndCheck = (min: number, max: number) => {
      const result = random(min, max);
      expect(result).toBeLessThanOrEqual(max);
      expect(result).toBeGreaterThanOrEqual(min);
    };

    for (let i = 0; i < 10; i++) {
      rollAndCheck(1, 6);
      rollAndCheck(4, 7);
      rollAndCheck(27, 35);
      rollAndCheck(-1, 1);
      rollAndCheck(0, 20);
    }
  });
});
