<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useGetSpotifyPlaylists } from '@/queries/useGetSpotifyPlaylists';

const {
  data: playlistsData,
  isLoading,
  refresh,
  error,
} = useGetSpotifyPlaylists();

type SortType = 'none' | 'name' | 'tracks';

const sortBy = ref<SortType>('none');

/**
 * A derived value that allows to sort the playlists
 */
const myPlaylists = computed(() => {
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

async function getMyPlaylists() {
  await refresh();
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
    </section>

    <div v-if="isLoading">
      Fetching user's playlists
    </div>

    <div v-if="error">
      Error: {{ error }}
    </div>

    <div v-if="myPlaylists.length > 0">
      <h2>My Playlists ({{ myPlaylists.length }} total)</h2>
      <p v-if="sortBy !== 'none'">
        Sorted by: {{ sortBy }}
      </p>

      <ul>
        <li v-for="playlist in myPlaylists" :key="playlist.id" class="my-4 flex gap-2">
          <img class="h-[3rem] w-[3rem]" :src="playlist.images?.[0]?.url" :alt="playlist.name">
          <div class="flex flex-col justify-center">
            <p class="text-green">
              {{ playlist.name }}
            </p>
            <p>
              {{ playlist.tracks?.total }} tracks
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="!isLoading && !error">
      No playlists found. Click "Get my playlists" to fetch them.
    </div>
  </div>
</template>
