<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { spotifySdk } from '@/lib/spotifyClient';
import { useGetSpotifyPlaylists } from '@/queries/useGetSpotifyPlaylists';
import router from '@/router';

// this triggers spotify log in
// because the query is using the spotify sdk
// so when the sdk doesn't find a user,
// it will redirect to the login page
const playlistsQuery = reactive(useGetSpotifyPlaylists());

type SortType = 'none' | 'name' | 'tracks';

const sortBy = ref<SortType>('none');

/**
 * A derived value that allows to sort the playlists
 */
const playlists = computed(() => {
  const items = playlistsQuery.data?.items || [];

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

async function getMyPlaylists() {
  await playlistsQuery.refresh();
}

function sortByName() {
  sortBy.value = 'name';
}

function sortByTracks() {
  sortBy.value = 'tracks';
}

function clearSort() {
  sortBy.value = 'none';
}

function logOut() {
  spotifySdk.logOut();
  router.push('/');
}
</script>

<template>
  <div>
    <p>This will only get the first page available for now</p>

    <section flex gap-2>
      <button btn @click="getMyPlaylists">
        Get my playlists
      </button>

      <button btn @click="sortByName">
        Sort by name
      </button>

      <button btn @click="sortByTracks">
        Sort by number of tracks
      </button>

      <button btn @click="clearSort">
        Clear sort
      </button>

      <button bg-slate btn @click="logOut">
        Log out Spotify
      </button>
    </section>

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

      <ul mt-4>
        <li
          v-for="playlist in playlists" :key="playlist.id"
        >
          <RouterLink
            :to="{
              name: '/spotify/playlists/[id]',
              params: {
                id: playlist.id,
              },
            }"
            class="group"
            my-1 p-2
            border-1 border-neutral-700
            rounded-md
            h-full w-full
            block
          >
            <div flex gap-2>
              <img class="h-auto w-5 object-contain" :src="playlist.images?.[0]?.url" :alt="playlist.name">
              <h2 text-green-200 group-hover:text-white>
                {{ playlist.name }}
              </h2>
              <p group-hover:text-green>
                {{ playlist.tracks?.total }} tracks
              </p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div v-else-if="!playlistsQuery.isLoading && !playlistsQuery.error">
      No playlists found. Click "Get my playlists" to fetch them.
    </div>
  </div>
</template>

<style scoped>
.group {
  transition: border-color 0.3s ease-in;
}

.group:hover {
  border-color: greenyellow; /* glow color */
  box-shadow: 0 0 10px rgba(86, 215, 0, 0.5); /* glow effect */
}
</style>
