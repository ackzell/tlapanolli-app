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
      <div p-4 flex flex-col h-70 w-full items-center justify-around>
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
        <ul
          v-kbd-trap.roving.vertical
          v-sibling-focus="{
            maxSiblings: 2,
            itemSelector: 'div',
          }"
        >
          <li v-for="track in playlistData.tracks.items" :key="track.track.id" class="group spotify-track">
            <div
              class="group spotify-track"
              my-1 p-2 border-1 border-neutral-700 rounded-md h-full w-full block
              tabindex="0"
            >
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
            </div>
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

.group {
  transition: all  0.35s ease-in;
}

/* TODO: make the colors dynamic */

.group:focus-visible,
.group:hover {
  border-color: var(--colors-green-DEFAULT); /* glow color */
  box-shadow: 0 0 8px oklch(0.792 0.209 151.711 ); /* glow effect */
  scale: 1.03;
}

.group:focus-visible {
  outline: none;
}

.group.spotify-track.prev-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
  scale: 1.02;
}

.group.spotify-track.prev-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.3);
  scale: 1.01;
}

.group.spotify-track.next-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.3);
  scale: 1.01;
}

.group.spotify-track.next-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
  scale: 1.02;
}
</style>
