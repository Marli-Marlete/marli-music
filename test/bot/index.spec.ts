import { afterAll, describe, expect, it, vi } from 'vitest';

import { botStartup } from '../../src/bot/index';
import { MarliMusic } from '../../src/bot/marli-music';

describe('src/bot/index.ts', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('botStartup', () => {
    it('should return a MarliMusic instance', () => {
      vi.spyOn(MarliMusic.prototype, 'login').mockReturnValueOnce(
        Promise.resolve('')
      );
      const marliMusic = botStartup();

      expect(marliMusic).toBeDefined();
    });
  });
});
