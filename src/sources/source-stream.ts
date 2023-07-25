import { Readable } from 'node:stream';

export interface ResultAudioSearch {
  title: string;
  duration: string;
  id: string;
  url: string;
}

export interface StreamInfo {
  title: string;
  url?: string;
  artist?: string;
}

export interface SerachOptionsParams {
  limit?: number;
}

export interface SourceStream {
  getStream(url: string): Readable | Promise<Readable>;
  search(
    input: string,
    options?: SerachOptionsParams
  ): ResultAudioSearch[] | Promise<ResultAudioSearch[]>;
  getStreamFromUrl(url: string): Promise<StreamInfo> | Promise<StreamInfo[]>;
  getTrack(url: string): Promise<StreamInfo>;
  getPlaylistTracks(url: string): Promise<StreamInfo[]>;
  validate(input: string): Promise<boolean>;
}
