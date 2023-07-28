import songLyrics from 'songlyrics';
import { LyricsSearch, SourceLyrics } from '../source-lyrics';

export class SongLyricsSource implements SourceLyrics {
  public async getLyrics(search: LyricsSearch): Promise<string> {
    const response = await songLyrics(search.artist + search.title);
    console.log(response);
    return response.lyrics;
  }
}
