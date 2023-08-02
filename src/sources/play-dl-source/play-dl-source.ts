import { Readable } from 'node:stream';
import play, { validate as validateStreamUrl, YouTubeVideo } from 'play-dl';

import { BotError, ERRORS } from '@/shared/errors';

import {
  ResultAudioSearch,
  SerachOptionsParams,
  SourceStream,
} from '../source-stream';
import { isValidStreamType, refreshAuthToken } from './auth';
import { playDlStrategies } from './strategies/strategy';

export class PlayDlSourceStream implements SourceStream {
  streamType = 'sp_track';

  async getStream(input: string): Promise<Readable> {
    try {
      const result = await play.stream(input, {
        quality: 2,
      });

      return result.stream;
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async search(
    input: string,
    options?: SerachOptionsParams
  ): Promise<ResultAudioSearch[]> {
    try {
      const result = await play.search(input, {
        ...(options?.limit && { limit: options.limit }),
        source: {
          youtube: 'video',
        },
      });

      if (!result.length) throw new Error(ERRORS.RESULT_NOT_FOUND);

      const resultMap = result.map((video: YouTubeVideo) => ({
        duration: video.durationRaw.toString(),
        id: video.id,
        title: video.title,
        url: video.url,
        artist: video.channel?.name ?? video?.music.shift()?.artist.toString(),
        thumbnail: {
          url: video.thumbnails.shift()?.url,
        },
      }));

      if (options?.limit === 1) {
        return [resultMap.shift()];
      }

      return resultMap;
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async getStreamFromUrl(url: string) {
    try {
      if (!url?.trim().startsWith('https')) return;

      const validUrl = await this.validate(url);

      if (!validUrl) throw new Error(ERRORS.INVALID_URL);

      await refreshAuthToken(this.streamType);

      const Strategy = playDlStrategies[this.streamType];

      return new Strategy(this).getStreamInfo(url);
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async validate(input: string): Promise<boolean> {
    this.streamType = String(await validateStreamUrl(input));

    if (Boolean(this.streamType) === false) return false;

    return isValidStreamType(this.streamType);
  }
}
