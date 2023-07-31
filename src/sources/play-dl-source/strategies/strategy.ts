import { StreamInfo } from '@/sources/source-stream';

import { PlayDlSourceStream } from '../play-dl-source';
import {
  SpotifyAlbumStrategy,
  SpotifyPlaylistStrategy,
  SpotifyTrackStrategy,
} from './spotify-strategy';
import { YoutubeStrategy } from './youtube-strategy';

export interface StrategyConstructor {
  new (playDl: PlayDlSourceStream): IStrategy;
}

export interface IStrategy {
  getStreamInfo(url: string): Promise<StreamInfo[]>;
}

export const playDlStrategies = {
  sp_playlist: SpotifyPlaylistStrategy,
  sp_track: SpotifyTrackStrategy,
  sp_album: SpotifyAlbumStrategy,
  yt_video: YoutubeStrategy,
};
