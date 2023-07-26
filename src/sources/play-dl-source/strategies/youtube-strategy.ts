import play from 'play-dl';

import { StreamInfo } from '@/sources/source-stream';

import { IStrategy } from './strategy';

export class YoutubeStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const videoInfo = await play.video_info(url);

    return [
      {
        title: videoInfo.video_details.title,
        url: videoInfo.video_details.url,
      },
    ];
  }
}
