import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const spotifySdk = SpotifyApi.withUserAuthorization(
  import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  import.meta.env.VITE_SPOTIFY_SCOPES.split(','),
);
