<script setup lang="ts">
import { createAPIClient } from '@tidal-music/api';
import { credentialsProvider, finalizeLogin, init } from '@tidal-music/auth';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import router from '@/router';

const route = useRoute();

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

  // const queryString = window.location.search;

  console.log('route query', route.query);

  const queryString = window.location.search;

  console.log('query string', queryString);

  await finalizeLogin(queryString);

  router.push('/tidal');
});
</script>

<template>
  <h1>Tidal Callback</h1>
</template>
