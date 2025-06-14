<script setup lang="ts">
import { onMounted } from 'vue';

import { spotifySdk } from '@/lib/spotifyClient';
import router from '@/router';

onMounted(async () => {
  try {
    await spotifySdk.authenticate();
    router.push('/spotify');
  }
  catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <h1>Bringing you in...</h1>
</template>
