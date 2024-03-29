import { Readable } from 'node:stream';

export interface ResultAudioSearch {
  title: string;
  duration: string;
  id: string;
  url: string;
  artist?: string;
  source?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
}

export interface StreamInfo {
  title: string;
  url?: string;
  artist?: string;
  source?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
}

export interface SerachOptionsParams {
  limit?: number;
}

export interface SourceStream {
  getStream(url: string): Promise<Readable>;
  search(
    input: string,
    options?: SerachOptionsParams
  ): Promise<ResultAudioSearch[]>;
  getStreamFromUrl(url: string): Promise<StreamInfo[]>;
  validate(input: string): Promise<boolean>;
}
