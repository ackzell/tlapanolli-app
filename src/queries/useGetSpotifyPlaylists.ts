import { defineQuery, useQuery } from '@pinia/colada';

import { spotifySdk } from '@/lib/spotifyClient';

export const useGetSpotifyPlaylists = defineQuery(() => {
  return useQuery({
    key: ['spotifyPlaylists'],
    query: () => spotifySdk.currentUser.playlists.playlists(),
  });
});
