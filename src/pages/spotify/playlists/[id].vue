<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada';
import { spotifySdk } from '@/lib/spotifyClient';

export const useSpotifyPlaylistByIdLoader = defineColadaLoader('/spotify/playlists/[id]', {
  async query(to) {
    const id = to.params.id as string;
    const result = await spotifySdk.playlists.getPlaylist(id);
    // console.log(result);
    return result;
  },
  key: to => ['playlists', to.params.id],
  staleTime: 24 * 60 * 60 * 1000, // 1 day
  lazy: true, // don't block the navigation until the data is loaded
});
</script>

<script lang="ts" setup>
const {
  data: playlistData,
  isLoading: isPlaylistLoading,
  error: playlistError,
} = useSpotifyPlaylistByIdLoader();
</script>

<template>
  <div>
    <div v-if="isPlaylistLoading">
      Fetching playlist
    </div>

    <div v-if="playlistError">
      Error: {{ playlistError }}
    </div>

    <div v-if="!isPlaylistLoading && playlistData" flex flex-col gap-2 items-start>
      <div flex flex-col h-70 w-full items-center justify-around>
        <p text-center>
          Playlist {{ playlistData?.name }} id: {{ playlistData?.id }}
        </p>
        <img
          :src="playlistData.images?.[0]?.url"
          :alt="playlistData.name"
          rounded-lg h-50 w-50 top-2 sticky object-cover
        >
      </div>

      <p>Tracks: </p>
      <div p-4 flex-1 overflow-auto class="playlist-container">
        <ul>
          <li v-for="track in playlistData.tracks.items" :key="track.track.id" class="group spotify-track">
            <span class="text-green-400">
              {{ track.track.name }}
            </span> -
            <span class="text-gray-100">
              {{ track.track.album.name }}
            </span> -
            <span class="text-amber">
              {{ track.track.album.artists[0].name }}
            </span>
            {{ new Date(track.track.album.release_date).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-container {
    /*
    2rem - padding top
    35px - nav tabs
    56px - nav header
    24px - "my playlists"
    280px - playlist image
    24px - "tracks" title
    16px - gap
    2rem - padding bottom
   */
  max-height: calc(100vh - 2rem - 35px - 56px - 24px - 280px - 24px - 16px - 2rem);
}
</style>
