<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import { useGetSpotifyPlaylistById } from '@/queries/useGetSpotifyPlaylistById';

const route = useRoute('/spotify/playlists/[id]');
const id = route.params.id;

const playlistQuery = reactive(useGetSpotifyPlaylistById(id));
</script>

<template>
  <div>
    <p>Playlist {{ playlistQuery.data?.name }} id: {{ id }}</p>

    <div v-if="playlistQuery.isLoading">
      Fetching playlist
    </div>

    <div v-if="playlistQuery.error">
      Error: {{ playlistQuery.error }}
    </div>

    <div v-if="playlistQuery.data">
      <p>Tracks: </p>

      <ul>
        <li v-for="track in playlistQuery.data.tracks.items" :key="track.track.id">
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
