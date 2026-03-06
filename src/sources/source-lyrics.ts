export interface LyricsSearch {
  title: string;
  artist?: string;
  userSearch?: string;
}

export interface SourceLyrics {
  getLyrics(input: LyricsSearch): Promise<string>;
}
