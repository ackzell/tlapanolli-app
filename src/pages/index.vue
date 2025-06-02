<script setup lang="ts">
import { computed, ref } from 'vue';

import { useGetSpotifyPlaylists } from '@/queries/useGetSpotifyPlaylists';

const {
  data: playlistsData,
  isLoading,
  refresh,
  error,
} = useGetSpotifyPlaylists();

const sortType = ref<'name' | 'tracks' | 'none'>('none');

const myPlaylists = computed(() => {
  const items = playlistsData.value?.items || [];

  if (sortType.value === 'name') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }
  else if (sortType.value === 'tracks') {
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
  sortType.value = 'name';
}

function sortByTracks() {
  sortType.value = 'tracks';
}

function clearSort() {
  sortType.value = 'none';
}
</script>

<template>
  <div>
    <p>This will only get the first page available for now</p>
    <button @click="getMyPlaylists">
      Get my playlists
    </button>

    <button @click="sortByName">
      Sort by name
    </button>

    <button @click="sortByTracks">
      Sort by number of tracks
    </button>

    <button @click="clearSort">
      Clear sort
    </button>

    <div v-if="isLoading">
      Fetching user's playlists
    </div>

    <div v-if="error">
      Error: {{ error }}
    </div>

    <div v-if="myPlaylists.length > 0">
      <h2>My Playlists ({{ myPlaylists.length }} total)</h2>
      <p v-if="sortType !== 'none'">
        Sorted by: {{ sortType }}
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
