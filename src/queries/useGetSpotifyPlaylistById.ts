import type { Ref } from 'vue';

import { useQuery } from '@pinia/colada';
import { unref } from 'vue';

import { spotifySdk } from '@/lib/spotifyClient';

export function useGetSpotifyPlaylistById(id: string | Ref<string>) {
  return useQuery({
    key: () => ['spotifyPlaylistById', unref(id)],
    query: () => spotifySdk.playlists.getPlaylist(unref(id)),
  });
}
