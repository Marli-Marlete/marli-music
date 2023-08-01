import play from 'play-dl';

import { StreamInfo } from '@/sources/source-stream';

import { IStrategy } from './strategy';

export class YouTubeVideoStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const videoInfo = await play.video_info(url);

    return [
      {
        title: videoInfo.video_details.title,
        url: videoInfo.video_details.url,
        artist:
          String(videoInfo.video_details.channel.name) ||
          String(videoInfo.video_details.music.shift().artist),
        thumbnail: {
          url: videoInfo.video_details.thumbnails.shift().url,
        },
      },
    ];
  }
}

export class YouTubePlaylistStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const playlist = await play.playlist_info(url.trim());

    const videos = await playlist.all_videos();

    const youtubeVideos = videos.map((videoInfo) => ({
      title: videoInfo.title,
      url: videoInfo.url,
      artist:
        String(videoInfo.channel.name) ||
        String(videoInfo.music.shift().artist),
    }));

    return youtubeVideos;
  }
}
