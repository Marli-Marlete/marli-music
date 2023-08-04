import play from 'play-dl';

const STREAM_TYPES = {
  youtube: ['yt_video', 'yt_playlist'],
  spotify: ['sp_track', 'sp_playlist', 'sp_album'],
  soundcloud: ['so_playlist', 'so_track'],
};

function isValidStreamType(streamType: string) {
  return Object.values(STREAM_TYPES).reduce(
    (acc, currentArray) => acc || currentArray.includes(streamType),
    false
  );
}

function isValidSpotifyStreamType(streamType: string) {
  return STREAM_TYPES.spotify.includes(streamType);
}

async function refreshAuthToken(streamType: string) {
  if (isValidSpotifyStreamType(streamType) && play.is_expired()) {
    await play.refreshToken();

    return;
  }
}

export {
  STREAM_TYPES,
  isValidStreamType,
  isValidSpotifyStreamType,
  refreshAuthToken,
};
