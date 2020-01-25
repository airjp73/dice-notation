import simpleDieRoll from '../simpleDieRoll';

describe('simpleDieRoll', () => {
  describe('tokenize', () => {
    it('should return a correct token', () => {
      expect(simpleDieRoll.tokenize('3d8')).toStrictEqual({
        count: 3,
        numSides: 8,
      });
    });
  });

  describe('roll', () => {
    it('should return an array with one number for each dice rolled', () => {
      const rolls = simpleDieRoll.roll({ count: 25, numSides: 6 });
      expect(rolls).toHaveLength(25);
      rolls.forEach(val => {
        expect(val).toBeLessThanOrEqual(6);
        expect(val).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('calculateValue', () => {
    it('should tall all the numbers in the rolls array', () => {
      const token = { count: 10, numSides: 10 };
      const rolls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(simpleDieRoll.calculateValue(token, rolls)).toEqual(55);
    });
  });
});
