import { Readable } from 'stream';
import { vi } from 'vitest';
import yts from 'yt-search';

export const mockVideoUrl = 'https://www.youtube.com/watch?v=qGl7b1EPwfA';

export const mockVideoResult: yts.VideoSearchResult = {
  duration: {
    seconds: 40,
    timestamp: '',
    toString: () => '40',
  },
  seconds: 40,
  title: 'video test 1',
  url: 'www.youtube.com/watch?=023912',
  videoId: 'qGl7b1EPwfA',
} as yts.VideoSearchResult;

export const mockYtVideoInfo = {
  player_response: {
    videoDetails: {
      title: mockVideoResult.title,
      videoId: 'qGl7b1EPwfA',
    },
  },
  videoDetails: {
    video_url: mockVideoUrl,
  },
};

export const mockSearchResult: Partial<yts.SearchResult> = {
  videos: [mockVideoResult],
};

export function setupYtdlStub() {
  vi.mock('ytdl-core', async () => {
    const original = await vi.importActual<typeof import('ytdl-core')>(
      'ytdl-core'
    );
    const ytdlMock = {
      ...original,
      default: (url: string) => {
        return url === mockVideoUrl ? new Readable() : null;
      },
      getInfo: () => mockYtVideoInfo,
      getURLVideoID: () => mockVideoUrl,
      validateURL: (url: string) => {
        console.log('NO MOCK VALIDATE URL');
        return url.includes('www.youtube.com/watch?v=');
      },
    };

    return ytdlMock;
  });

  vi.mock('yt-search', async () => {
    return {
      default: (query: string) => {
        if (query === 'test') return Promise.resolve(mockSearchResult);
        return { videos: [] };
      },
    };
  });
}
