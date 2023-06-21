import { afterAll, describe, expect, it, vi } from 'vitest';

import { mainRouter } from '../../../src/http/routes/index';

describe('src/http/routes/index.ts', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('mainRouter', () => {
    it('should return mainRouter', () => {
      const mainRouterSpy = vi.spyOn(mainRouter, 'get');
      expect(mainRouterSpy).toBeDefined();
    });
  });
});
