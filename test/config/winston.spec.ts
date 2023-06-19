import { afterAll, describe, expect, it, vi } from 'vitest'

import { fileLogger, logger } from '../../src/config/winston'

describe('src/config/winston.ts', () => {
  vi.useFakeTimers();

  afterAll(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should run logger log correctly', () => {
    const level = 'debug';
    const message = 'testing logger';

    vi.spyOn(logger, 'log');

    logger.log(level, message);

    expect(logger.log).toHaveBeenCalledOnce();
    expect(logger.log).toBeCalledWith(level, message);
  });

  it('should run fileLogger log correctly', () => {
    const level = 'error';
    const message = 'Some Error has Happened';
    const error = new Error(message);
    vi.spyOn(fileLogger, 'log');
    const systemDate = new Date(2023, 3, 23, 1);
    vi.setSystemTime(systemDate);

    fileLogger.log(level, message, error);

    expect(fileLogger.log).toHaveBeenCalledOnce();
    expect(fileLogger.log).toBeCalledWith(level, message, error);
  });
});
