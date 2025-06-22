<script setup lang="ts">
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

import { onKeyStroke } from '@vueuse/core';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps<{ playlists: SimplifiedPlaylist[] }>();

function focusFirstPlaylist() {
  const firstPlaylist = document.querySelector('.spotify-playlist') as HTMLElement;
  if (firstPlaylist) {
    firstPlaylist.focus();
  }
}

function focusNextPlaylist(element: HTMLElement) {
  // the active element is an anchor
  // so we need to go up one level, to a li element
  // and then focus the next sibling
  const parent = element.parentElement as HTMLElement;
  if (parent) {
    const nextSibling = parent.nextElementSibling as HTMLElement;
    if (nextSibling) {
      // now go into the anchor tag again
      // and focus the next sibling
      const anchor = nextSibling.querySelector('a') as HTMLElement;
      if (anchor) {
        anchor.focus();
      }
    }
  }
}

function focusPreviousPlaylist(element: HTMLElement) {
  // the active element is an anchor
  // so we need to go up one level, to a li element
  // and then focus the next sibling
  const parent = element.parentElement as HTMLElement;
  if (parent) {
    const prevSibling = parent.previousElementSibling as HTMLElement;
    if (prevSibling) {
      // now go into the anchor tag again
      // and focus the next sibling
      const anchor = prevSibling.querySelector('a') as HTMLElement;
      if (anchor) {
        anchor.focus();
      }
    }
  }
}

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
  e.preventDefault();
  const activeElement = document.activeElement as HTMLElement;
  if (!activeElement.classList.contains('spotify-playlist')) {
    focusFirstPlaylist();
  }
});

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault();
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement) {
    focusNextPlaylist(activeElement);
  }
});

onKeyStroke('ArrowUp', (e) => {
  e.preventDefault();
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement) {
    focusPreviousPlaylist(activeElement);
  }
});

onKeyStroke('ArrowRight', (e) => {
  e.preventDefault();
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement) {
    activeElement.click();
  }
});

onMounted(() => {
  // focus on the first playlist
  focusFirstPlaylist();
});
</script>

<template>
  <ul
    v-sibling-focus="{
      maxSiblings: 3,
      enableMultiple: true,
      prioritizeFocus: true,
      clearHoverOnKeyboard: true,
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
        class="group spotify-playlist my-1 p-2 border-1 border-neutral-700 rounded-md h-full w-full block"
      >
        <div flex gap-2>
          <img
            class="h-auto w-5 object-contain filter-grayscale-100 group-focus:filter-none group-hover:filter-none"
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
  transition: border-color  0.35s ease-in;
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
}

.group:focus-visible {
  outline: none;
}

.group.spotify-playlist.prev-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
}

.group.spotify-playlist.prev-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.2);
}

.group.spotify-playlist.next-sibling-2 {
  border-color: oklch(0.792 0.209 151.711/0.2);
}

.group.spotify-playlist.next-sibling-1 {
  border-color: oklch(0.792 0.209 151.711/0.4);
}
</style>
