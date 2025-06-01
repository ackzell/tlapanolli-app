import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export function useSpotify() {
  const sdk = SpotifyApi.withUserAuthorization(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    import.meta.env.VITE_SPOTIFY_SCOPE.split(','),
  );

  return { spotifySdk: sdk };
}
