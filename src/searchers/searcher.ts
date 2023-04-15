export interface ResultAudioSearch {
	id?: string;
	title: string;
	duration: string;
}
export interface Searcher {
	search(input: string): Promise<ResultAudioSearch[]>;
}
