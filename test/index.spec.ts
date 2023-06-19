import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { botStartup } from '../src/bot'
import { initConfigs } from '../src/config'
import { startServer } from '../src/http'

describe('src/index.ts', () => {
  beforeAll(() => {
    vi.mock('../src/http/index');
    vi.mock('../src/config/index');
    vi.mock('../src/bot/index');
  });

  afterAll(() => {
    vi.clearAllMocks();

    it('should have called', () => {
      expect(startServer()).toBeCalled();
    });
  });

  it('should run correctly all functions', () => {
    initConfigs();
    startServer();
    botStartup();

    expect(initConfigs).toHaveBeenCalled();
    expect(startServer).toHaveBeenCalled();
    expect(startServer).toHaveBeenCalled();
  });
});
