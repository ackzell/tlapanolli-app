import { createAPIClient } from '@tidal-music/api';
import { credentialsProvider, init } from '@tidal-music/auth';

export async function createTidalClient() {
  await initTidal();
  return createAPIClient(credentialsProvider);
}

export async function initTidal() {
  return init({
    clientId: import.meta.env.VITE_TIDAL_CLIENT_ID,
    clientSecret: import.meta.env.VITE_TIDAL_SECRET_ID,
    credentialsStorageKey: 'tidal-credentials',
    scopes: [
      'user.read',
      'collection.read',
      'search.read',
      'playlists.write',
      'playlists.read',
      'entitlements.read',
      'collection.write',
      'recommendations.read',
      'playback',
      'search.write',
    ],
  });
}
