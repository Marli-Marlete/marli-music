import { LyricsSearch } from './../source-lyrics';
import genius from 'genius-lyrics-ts';
import { SongLyricsSource } from '../song-lyrics/song-lyrics-source';

export class GeniusLyricsSource implements SongLyricsSource {
  public async getLyrics(search: LyricsSearch, retries = 2): Promise<string> {
    try {
      const { artist, title } = search;
      console.log({ search, retries });
      const response = await genius({ title, artist, optimizeQuery: false });
      console.log({ response });
      if (!response) throw new Error('LYRICS_NOT_FOUND');
      return response;
    } catch (error) {
      console.log({ error });
      if (retries > 1) {
        return await this.getLyrics(
          {
            title: search.userSearch,
          },
          --retries
        );
      } else throw new Error('LYRICS_NOT_FOUND');
    }
  }
}
