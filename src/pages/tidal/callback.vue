<script setup lang="ts">
import { credentialsProvider, finalizeLogin } from '@tidal-music/auth';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { initTidal } from '@/lib/tidalClient';
import router from '@/router';

const route = useRoute();

onMounted(async () => {
  await initTidal();

  // const queryString = window.location.search;

  console.log('route query', route.query);

  const queryString = window.location.search;

  console.log('query string', queryString);

  await finalizeLogin(queryString);

  console.log('credentials', await credentialsProvider.getCredentials());

  localStorage.setItem('tidal-user-logged-in', 'true');

  router.push('/tidal');
});
</script>

<template>
  <h1>Bringing you in from tidal...</h1>
</template>
