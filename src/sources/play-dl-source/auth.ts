import play from 'play-dl';

const STREAM_TYPES = {
  youtube: ['yt_video', 'yt_playlist'],
  spotify: ['sp_track', 'sp_playlist', 'sp_album'],
  soundcloud: ['so_playlist', 'so_track'],
};

function isValidStreamType(streamType: string) {
  return [...STREAM_TYPES.spotify, ...STREAM_TYPES.youtube].includes(
    streamType
  );
}

function isValidSpotifyStreamType(streamType: string) {
  return STREAM_TYPES.spotify.includes(streamType);
}

function isValidSoundCloudStreamType(streamType: string) {
  return STREAM_TYPES.soundcloud.includes(streamType);
}

async function refreshAuthToken(streamType: string) {
  if (isValidSpotifyStreamType(streamType) && play.is_expired()) {
    await play.refreshToken();

    return;
  }

  if (isValidSoundCloudStreamType) {
    const clientId = await play.getFreeClientID();

    play.setToken({
      soundcloud: {
        client_id: clientId,
      },
    });
  }
}

export {
  STREAM_TYPES,
  isValidStreamType,
  isValidSpotifyStreamType,
  refreshAuthToken,
};
