import { useQuery } from '@pinia/colada';

import { spotifySdk } from '@/lib/spotifyClient';

export function useGetSpotifyPlaylistById(id: string) {
  return useQuery({
    key: () => ['spotifyPlaylistById', id],
    query: () => spotifySdk.playlists.getPlaylist(id),
  });
}
