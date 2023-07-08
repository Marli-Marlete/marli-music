import { describe, expect, it } from 'vitest';
import { shuffleArray } from '../../src/helpers/helpers';

describe('shuffleArray', () => {
  it('should return an array with different order', () => {
    expect(shuffleArray<number>([1, 2, 3, 4])).not.toEqual([1, 2, 3, 4]);
  });

  it('should return an empty array if it was passed in param', () => {
    expect(shuffleArray([])).toEqual([]);
  });
});
