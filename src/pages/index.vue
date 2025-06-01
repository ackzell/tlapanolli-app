<script setup lang="ts">
import type { Page, SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

import { ref } from 'vue';

import { useSpotify } from '@/composables/useSpotify';

const myPlaylists = ref<Page<SimplifiedPlaylist>>();

let currentPlaylists: SimplifiedPlaylist[] = [];

const { spotifySdk } = useSpotify();

async function getMyPlaylists() {
  myPlaylists.value = await spotifySdk.currentUser.playlists.playlists();
  currentPlaylists = myPlaylists.value?.items;
}

function sortByName() {
  currentPlaylists = currentPlaylists.sort((a, b) => a.name.localeCompare(b.name));
}

function sortByTracks() {
  currentPlaylists = currentPlaylists.sort((a, b) => {
    const aTracks = a.tracks?.total || 0;
    const bTracks = b.tracks?.total || 0;

    return aTracks - bTracks;
  });
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

    <!-- <pre>
    {{ JSON.stringify(myPlaylists, null, 2) }}
  </pre> -->

    <div v-if="myPlaylists">
      <h2>My Playlists</h2>
      <ul>
        <li v-for="playlist in currentPlaylists" :key="playlist.id" my-4 flex gap-2>
          <img class="h-[3rem] w-[3rem]" :src="playlist.images?.[0]?.url">
          <div flex flex-col justify-center>
            <p text-green>
              {{ playlist.name }}
            </p>
            <p>
              {{ playlist.tracks?.total }} tracks
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
