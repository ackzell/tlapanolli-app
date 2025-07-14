<script lang="ts">
import { computed, ref } from 'vue';
import { spotifySdk } from '@/lib/spotifyClient';

import PlaylistSelector from '@/pages/spotify/playlists/components/PlaylistSelector.vue';
import router from '@/router';
import { useSpotifyPlaylistsLoader } from './playlists/loaders/playlists.loader';

export { useSpotifyPlaylistsLoader };
</script>

<script setup lang="ts">
type SortType = 'none' | 'name' | 'tracks';
const sortBy = ref<SortType>('none');

// this triggers spotify log in
// because the query is using the spotify sdk
// so when the sdk doesn't find a user,
// it will redirect to the login page
const playlistsQuery = useSpotifyPlaylistsLoader();
// console.log('playlistsQuery', playlistsQuery);

/**
 * A derived value that allows to sort the playlists
 */
const playlists = computed(() => {
  const items = playlistsQuery.data.value?.items || [];

  if (sortBy.value === 'name') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }
  else if (sortBy.value === 'tracks') {
    return [...items].sort((a, b) => {
      const aTracks = a.tracks?.total || 0;
      const bTracks = b.tracks?.total || 0;
      return aTracks - bTracks;
    });
  }

  return items;
});

function logOut() {
  spotifySdk.logOut();
  router.push('/');
}
</script>

<template>
  <div>
    <div>
      <p>This will only get the first page available for now</p>
      <section flex gap-2>
        <button btn @click="async () => await playlistsQuery.refresh()">
          Get my playlists
        </button>

        <button btn @click="sortBy = 'name';">
          Sort by name
        </button>

        <button btn @click="sortBy = 'tracks';">
          Sort by number of tracks
        </button>

        <button btn @click="sortBy = 'none';">
          Clear sort
        </button>

        <button bg-slate btn @click="logOut">
          Log out Spotify
        </button>
      </section>
    </div>

    <div v-if="playlistsQuery.isLoading">
      Fetching user's playlists
    </div>

    <div v-if="playlistsQuery.error">
      Error: {{ playlistsQuery.error }}
    </div>

    <div v-if="playlists.length > 0">
      <h2>My Playlists ({{ playlists.length }} total)</h2>
      <p v-if="sortBy !== 'none'">
        Sorted by: {{ sortBy }}
      </p>

      <div class="spotify-stuff-container">
        <div flex flex-grow flex-basis-0 gap-4 h-full>
          <div flex-1 h-full overflow-auto>
            <PlaylistSelector :playlists="playlists" />
          </div>

          <div flex-1 h-full overflow-auto>
            <RouterView />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!playlistsQuery.isLoading && !playlistsQuery.error">
      No playlists found. Click "Get my playlists" to fetch them.
    </div>
  </div>
</template>

<style scoped>
.spotify-stuff-container {
  /*
    2rem - padding top
    35px - nav tabs
    56px - nav header
    24px - "my playlists"
    2rem - padding bottom
   */
  height: calc(100vh - 2rem - 35px - 56px - 24px - 2rem);
  min-height: 4rem;

}
</style>
