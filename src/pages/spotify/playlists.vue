<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada';
import { computed, ref } from 'vue';
import { spotifySdk } from '@/lib/spotifyClient';

import PlaylistSelector from '@/pages/spotify/playlists/components/PlaylistSelector.vue';
import router from '@/router';

export const useSpotifyPlaylistsLoader = defineColadaLoader('/spotify/playlists', {
  async query() {
    const result = await spotifySdk.currentUser.playlists.playlists();
    // console.log(result);
    return result;
  },
  key: ['spotifyPlaylists'],
  staleTime: 24 * 60 * 60 * 1000, // 1 day
});
</script>

<script setup lang="ts">
type SortType = 'none' | 'name' | 'tracks';

const sortBy = ref<SortType>('none');

const {
  data: playlistsData,
  error: playlistsError,
  isLoading: playlistIsLoading,
  refresh: playlistsRefreh,
} = useSpotifyPlaylistsLoader();

/**
 * A derived value that allows to sort the playlists
 */
const playlists = computed(() => {
  const items = playlistsData.value?.items || [];

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
        <button btn @click="async () => await playlistsRefreh()">
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

    <div v-if="playlistIsLoading">
      Fetching user's playlists
    </div>

    <div v-if="playlistsError">
      Error: {{ playlistsError }}
    </div>

    <div v-if="playlists.length > 0">
      <h2>My Playlists ({{ playlists.length }} total)</h2>
      <p v-if="sortBy !== 'none'">
        Sorted by: {{ sortBy }}
      </p>

      <div class="spotify-stuff-container">
        <div
          v-kbd-trap.roving.horizontal
          flex flex-grow flex-basis-0 gap-4 h-full
        >
          <div
            v-kbd-trap.roving.vertical
            p-3 flex-1 h-full overflow-y-scroll
          >
            <PlaylistSelector
              :playlists="playlists"
            />
          </div>

          <div
            v-kbd-trap.roving.vertical
            flex-1 h-full
          >
            <RouterView />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!playlistIsLoading && !playlistsError">
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
