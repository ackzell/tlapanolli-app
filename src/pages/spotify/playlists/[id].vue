<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useGetSpotifyPlaylistById } from '@/queries/useGetSpotifyPlaylistById';

const route = useRoute('/spotify/playlists/[id]');
const id = computed(() => route.params.id as string);

const {
  data: playlistData,
  isLoading: isPlaylistLoading,
  error: playlistError,
} = useGetSpotifyPlaylistById(id);
</script>

<template>
  <div>
    <p>Playlist {{ playlistData?.name }} id: {{ id }}</p>

    <div v-if="isPlaylistLoading">
      Fetching playlist
    </div>

    <div v-if="playlistError">
      Error: {{ playlistError }}
    </div>

    <div v-if="playlistData">
      <p>Tracks: </p>

      <ul>
        <li v-for="track in playlistData.tracks.items" :key="track.track.id">
          <span text-green-400>
            {{ track.track.name }}
          </span> -
          <span text-gray-100>
            {{ track.track.album.name }}
          </span> -
          <span text-amber>
            {{ track.track.album.artists[0].name }}
          </span>
          {{ new
            Date(track.track.album.release_date).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric' }) }}
        </li>
      </ul>
    </div>
  </div>
</template>
