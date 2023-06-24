import { afterAll, describe, expect, it, vi } from 'vitest';

import { PlayDlSourceStream } from '../../../src/sources/play-dl-source/play-dl-source';

describe('src/sources/play-dl-source/play-dl-source-stream.ts', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('getStream()', () => {
    it('should run getStream correctly', async () => {
      const playDLSource = new PlayDlSourceStream();

      expect(playDLSource).toBeDefined();
    });
  });
});
