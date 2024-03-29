import play, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack } from 'play-dl';

import { sanitizeUrl } from '@/helpers/helpers';
import { StreamInfo } from '@/sources/source-stream';

import { PlayDlSourceStream } from '../play-dl-source';
import { IStrategy } from './strategy';

export class SpotifyTrackStrategy implements IStrategy {
  constructor(private playDlSourceStream: PlayDlSourceStream) {}

  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const spotifyInfo = (await play.spotify(sanitizeUrl(url))) as SpotifyTrack;

    const searched = (
      await this.playDlSourceStream.search(
        `${spotifyInfo.name} - ${spotifyInfo?.artists.shift()?.name}`,
        {
          limit: 1,
        }
      )
    ).shift();

    return [
      {
        title: spotifyInfo.name,
        url: searched.url,
        source: {
          url: spotifyInfo.url,
        },
        artist: spotifyInfo?.artists.shift()?.name ?? searched.artist,
        thumbnail: {
          url: spotifyInfo.thumbnail.url,
        },
      },
    ];
  }
}

export class SpotifyPlaylistStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const playlist = (await play.spotify(sanitizeUrl(url))) as SpotifyPlaylist;

    const tracks = await playlist.all_tracks();

    const spotifyTracks = tracks.map((track) => ({
      title: track.name,
      url: undefined,
      artist: track?.artists.shift().name,
    }));

    return spotifyTracks;
  }
}

export class SpotifyAlbumStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const album = (await play.spotify(sanitizeUrl(url))) as SpotifyAlbum;

    const tracks = await album.all_tracks();

    const spotifyTracks = tracks.map((track) => ({
      title: track.name,
      url: undefined,
      artist: track?.artists.shift().name,
    }));

    return spotifyTracks;
  }
}
