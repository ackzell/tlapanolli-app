import { defineQuery, useQuery } from '@pinia/colada';

import { useSpotify } from '@/composables/useSpotify';

const { spotifySdk } = useSpotify();

export const useGetSpotifyPlaylists = defineQuery(() => {
  return useQuery({
    key: ['spotifyPlaylists'],
    query: () => spotifySdk.currentUser.playlists.playlists(),
  });
});
