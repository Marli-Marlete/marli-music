import { StreamInfo } from '@/sources/source-stream';

import { PlayDlSourceStream } from '../play-dl-source';
import {
  SpotifyPlaylistStrategy,
  SpotifyTrackStrategy,
} from './spotify-strategy';
import {
  YouTubePlaylistStrategy,
  YouTubeVideoStrategy,
} from './youtube-strategy';

export interface StrategyConstructor {
  new (playDl: PlayDlSourceStream): IStrategy;
}

export interface IStrategy {
  getStreamInfo(url: string): Promise<StreamInfo[]>;
}

export const playDlStrategies = {
  sp_playlist: SpotifyPlaylistStrategy,
  sp_track: SpotifyTrackStrategy,
  yt_video: YouTubeVideoStrategy,
  yt_playlist: YouTubePlaylistStrategy,
};
