<script setup lang="ts">
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

import { onKeyStroke } from '@vueuse/core';
import { RouterLink } from 'vue-router';

const props = defineProps<{ playlists: SimplifiedPlaylist[] }>();

onKeyStroke([' '], (e) => {
  e.preventDefault();
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement) {
    activeElement.click();
  }
});
</script>

<template>
  <ul
    v-kbd-trap.roving.vertical
    v-sibling-focus="{
      maxSiblings: 2,
    }"
  >
    <li
      v-for="playlist in props.playlists" :key="playlist.id"
    >
      <RouterLink
        :to="{
          name: '/spotify/playlists/[id]',
          params: { id: playlist.id },
        }"
        class="spotify-playlist group"
        my-1 p-2 border-1 border-neutral-700 rounded-md h-full w-full block
      >
        <div flex gap-2>
          <img
            h-auto w-5 object-contain filter-grayscale-100 group-focus:filter-none group-hover:filter-none
            :src="playlist.images?.[0]?.url" :alt="playlist.name"
          >
          <h2>
            {{ playlist.name }}
          </h2>
          <p>
            {{ playlist.tracks?.total }} tracks
          </p>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.group {
  transition: all  0.35s ease-in;
}

/* TODO: make the colors dynamic */

/* Only apply hover/focus styles to p and p when NOT active */
.group.spotify-playlist:not(.router-link-active):not(.router-link-exact-active):hover p,
.group.spotify-playlist:not(.router-link-active):not(.router-link-exact-active):focus-visible p {
  color: var(--colors-green-DEFAULT);
}

/* Only apply hover/focus styles to p and p when NOT active */
.group.spotify-playlist:not(.router-link-active):not(.router-link-exact-active):hover h2,
.group.spotify-playlist:not(.router-link-active):not(.router-link-exact-active):focus-visible h2 {
  color: var(--vt-c-white);
}

.group.spotify-playlist.router-link-active,
.group.spotify-playlist.router-link-exact-active,
.group.spotify-playlist.router-link-active:hover,
.group.spotify-playlist.router-link-exact-active:hover {
  border-color: var(--colors-green-DEFAULT); /* glow color */
  background-color: var(--colors-green-DEFAULT); /* background color */
  color: var(--vt-c-black);
}

.group:focus-visible,
.group:hover {
  border-color: var(--colors-green-DEFAULT); /* glow color */
  box-shadow: 0 0 8px oklch(0.792 0.209 151.711 ); /* glow effect */
  scale: 1.04;
}

.group:focus-visible {
  outline: none;
}

.group.spotify-playlist.prev-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
  scale: 1.02;
}

.group.spotify-playlist.prev-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.3);
  scale: 1.01;
}

.group.spotify-playlist.next-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.3);
  scale: 1.01;
}

.group.spotify-playlist.next-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
  scale: 1.02;
}
</style>
