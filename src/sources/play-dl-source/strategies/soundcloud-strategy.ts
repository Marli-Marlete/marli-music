import play, { SoundCloudPlaylist, SoundCloudTrack } from 'play-dl';

import { StreamInfo } from '@/sources/source-stream';

import { PlayDlSourceStream } from '../play-dl-source';
import { IStrategy } from './strategy';

export class SoundCloudTrackStrategy implements IStrategy {
  constructor(private playDlSourceStream: PlayDlSourceStream) {}

  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const soundCloudInfo = (await play.soundcloud(
      url.trim()
    )) as SoundCloudTrack;

    const searched = (
      await this.playDlSourceStream.search(
        `${soundCloudInfo.name} - ${soundCloudInfo.user.name}`,
        {
          limit: 1,
        }
      )
    ).shift();

    return [
      {
        title: soundCloudInfo.name,
        url: searched.url,
        artist: soundCloudInfo.user.name,
        source: {
          url: soundCloudInfo.url,
        },
        thumbnail: {
          url: soundCloudInfo.thumbnail,
        },
      },
    ];
  }
}

export class SoundCloudPlaylistStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const playlist = (await play.soundcloud(url.trim())) as SoundCloudPlaylist;

    const tracks = await playlist.all_tracks();

    const soundcloudTracks = tracks.map((track) => ({
      title: track.name,
      url: undefined,
      artist: track?.user.name,
      source: {
        url: track.url,
      },
      thumbnail: {
        url: track.thumbnail,
      },
    }));

    return soundcloudTracks;
  }
}
