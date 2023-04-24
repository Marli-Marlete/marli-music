import yts from 'yt-search';

export const mockVideoUrl = 'https://www.youtube.com/watch?v=qGl7b1EPwfA';

export const mockVideoResult: yts.VideoSearchResult = {
	videoId: '023912',
	title: 'video test 1',
	seconds: 40,
	url: 'www.youtube.com/watch?=023912',
	duration: {
		seconds: 40,
		toString: () => '40',
		timestamp: '',
	},
} as yts.VideoSearchResult;

export const mockSearchResult: Partial<yts.SearchResult> = {
	videos: [mockVideoResult],
};
