<script setup lang="ts">
import { createAPIClient } from '@tidal-music/api';
import { credentialsProvider, init, initializeLogin } from '@tidal-music/auth';
import { onMounted, ref } from 'vue';

const user = ref();

onMounted(async () => {
  await init({
    clientId: import.meta.env.VITE_TIDAL_CLIENT_ID,
    clientSecret: import.meta.env.VITE_TIDAL_SECRET_ID,
    credentialsStorageKey: 'tidal-credentials',
    scopes: [
      'user.read',
      'collection.read',
      'search.read',
      'playlists.write',
      'playlists.read',
      'entitlements.read',
      'collection.write',
      'recommendations.read',
      'playback',
      'search.write',
    ],
  });
});

async function loginWithTidal() {
  const redirectUri = await initializeLogin({
    redirectUri: import.meta.env.VITE_TIDAL_REDIRECT_URI,
  });

  window.location.href = redirectUri;
}

async function getMyUser() {
  const apiClient = createAPIClient(credentialsProvider);

  user.value = await apiClient.GET('/users/me');
}
</script>

<template>
  <h1>Tidal</h1>

  <button btn @click="loginWithTidal">
    Login with Tidal
  </button>

  <button btn @click="getMyUser">
    Get my user
  </button>

  <pre>{{ user }}</pre>
</template>
