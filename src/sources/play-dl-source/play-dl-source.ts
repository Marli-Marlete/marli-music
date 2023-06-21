import { Readable } from 'node:stream';
import play, { validate as validateStreamUrl, YouTubeVideo } from 'play-dl';

import { ERRORS } from '../../shared/errors';
import {
  ResultAudioSearch,
  SerachOptionsParams,
  SourceStream,
} from '../source-stream';

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
      console.debug(e);
      throw new Error(ERRORS.RESULT_NOT_FOUND);
    }
  }

  async search(
    input: string,
    options?: SerachOptionsParams
  ): Promise<ResultAudioSearch[]> {
    const result = await play.search(input, {
      ...(options?.limit && { limit: options.limit }),
      source: {
        youtube: 'video',
      },
    });

    return result.map((video: YouTubeVideo) => ({
      duration: video.durationRaw.toString(),
      id: video.id,
      title: video.title,
      url: video.url,
    }));
  }

  async getStreamFromUrl(url: string) {
    if (!url.trim().startsWith('https')) return;

    const validUrl = await this.validate(url);

    if (!validUrl) throw new Error(ERRORS.INVALID_URL);

    if (this.streamType === 'sp_track') {
      if (play.is_expired()) {
        console.log({ expired: play.is_expired() });
        await play.refreshToken();
      }

      const spotifyInfo = await play.spotify(url.trim());

      const searched = await this.search(spotifyInfo.name, {
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
  }

  async validate(input: string): Promise<boolean> {
    this.streamType = await validateStreamUrl(input);

    console.log({ streamType: this.streamType });

    if (this.streamType === false) return false;

    return validStreamTypes.includes(this.streamType);
  }
}
