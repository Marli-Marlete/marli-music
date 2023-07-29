import play from 'play-dl';

const STREAM_TYPES = {
  youtube: ['yt_video'],
  spotify: ['sp_track', 'sp_playlist', 'sp_album'],
};

function isValidStreamType(streamType: string) {
  return [...STREAM_TYPES.spotify, ...STREAM_TYPES.youtube].includes(
    streamType
  );
}

function isValidSpotifyStreamType(streamType: string) {
  return STREAM_TYPES.spotify.includes(streamType);
}

async function refreshAuthToken(streamType: string) {
  if (isValidSpotifyStreamType(streamType) && play.is_expired()) {
    await play.refreshToken();
  }
}

export {
  STREAM_TYPES,
  isValidStreamType,
  isValidSpotifyStreamType,
  refreshAuthToken,
};
