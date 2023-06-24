import { Readable } from 'node:stream';
import play, { validate as validateStreamUrl, YouTubeVideo } from 'play-dl';

import {
  ResultAudioSearch,
  SerachOptionsParams,
  SourceStream,
} from '../source-stream';

import { BotError, ERRORS } from '../../shared/errors';

const validStreamTypes = ['yt_video', 'sp_track'];

export class PlayDlSourceStream implements SourceStream {
  streamType: string | false = 'sp_track';

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

      return result.map((video: YouTubeVideo) => ({
        duration: video.durationRaw.toString(),
        id: video.id,
        title: video.title,
        url: video.url,
      }));
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async getStreamFromUrl(url: string) {
    try {
      if (!url.trim().startsWith('https')) return;

      const validUrl = await this.validate(url);

      if (!validUrl) throw new Error(ERRORS.INVALID_URL);

      if (this.streamType === 'sp_track') {
        if (play.is_expired()) {
          await play.refreshToken();
        }

        const spotifyInfo = await play.spotify(url.trim());

        const searched = await this.search(`${spotifyInfo.name} - ${spotifyInfo.artists[0].name}`, {
          limit: 1,
        });

        return {
          title: spotifyInfo.name,
          url: searched[0].url,
        };
      }

      if (this.streamType === 'yt_video') {
        const videoInfo = await play.video_info(url);

        return {
          title: videoInfo.video_details.title,
          url: videoInfo.video_details.url,
        };
      }
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async validate(input: string): Promise<boolean> {
    this.streamType = await validateStreamUrl(input);

    if (this.streamType === false) return false;

    return validStreamTypes.includes(this.streamType);
  }
}
