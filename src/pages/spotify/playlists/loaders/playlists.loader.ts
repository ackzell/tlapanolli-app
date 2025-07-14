import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada';

import { spotifySdk } from '@/lib/spotifyClient';

export const useSpotifyPlaylistsLoader = defineColadaLoader('/spotify/playlists', {
  async query() {
    const result = await spotifySdk.currentUser.playlists.playlists();
    console.log(result);
    return result;
  },
  key: ['spotifyPlaylists'],
  staleTime: 24 * 60 * 60 * 1000, // 1 day
});
