import { Readable } from 'node:stream';
import play, {
  SpotifyPlaylist,
  SpotifyTrack,
  validate as validateStreamUrl,
  YouTubeVideo,
} from 'play-dl';

import { BotError, ERRORS } from '../../shared/errors';
import {
  ResultAudioSearch,
  SerachOptionsParams,
  SourceStream,
} from '../source-stream';

const youtubeStreamTypes = ['yt_video'];
const spotifyStreamTypes = ['sp_track', 'sp_playlist'];
const validStreamTypes = [...youtubeStreamTypes, ...spotifyStreamTypes];

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
      if (!url?.trim().startsWith('https')) return;

      const validUrl = await this.validate(url);

      if (!validUrl) throw new Error(ERRORS.INVALID_URL);

      if (spotifyStreamTypes.includes(this.streamType) && play.is_expired()) {
        await play.refreshToken();
      }

      if (this.streamType === 'sp_playlist') {
        const playlist = (await play.spotify(url.trim())) as SpotifyPlaylist;

        const tracks = await playlist.all_tracks();

        const spotifyTracks = tracks.map((track) => ({
          title: track.name,
          url: undefined,
          artist: String(track?.artists[0].name) ?? undefined,
        }));

        return spotifyTracks;
      }

      if (this.streamType === 'sp_track') {
        const spotifyInfo = (await play.spotify(url.trim())) as SpotifyTrack;

        const searched = await this.search(
          `${spotifyInfo.name} - ${spotifyInfo.artists[0].name}`,
          {
            limit: 1,
          }
        );

        return [
          {
            title: spotifyInfo.name,
            url: searched[0].url,
          },
        ];
      }

      if (this.streamType === 'yt_video') {
        const videoInfo = await play.video_info(url);

        return [
          {
            title: videoInfo.video_details.title,
            url: videoInfo.video_details.url,
          },
        ];
      }
    } catch (e) {
      throw new BotError(e.stack || e.message, ERRORS.RESULT_NOT_FOUND);
    }
  }

  async validate(input: string): Promise<boolean> {
    this.streamType = String(await validateStreamUrl(input));

    if (Boolean(this.streamType) === false) return false;

    return validStreamTypes.includes(this.streamType);
  }
}
