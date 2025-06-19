<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header>
    <nav>
      <div flex gap-4 justify-center class="items-center">
        <RouterLink to="/spotify" hover:text-green :class="{ 'text-green': route.path.startsWith('/spotify') }">
          <div class="i-logos:spotify-icon?mask mr-1 h-[35px]" />
          Spotify Stuff
        </RouterLink>

        <RouterLink to="/tidal" hover:text-white :class="{ 'text-white': route.path.startsWith('/tidal') }">
          <div class="i-logos:tidal-icon?mask mr-1 h-[35px]" />
          Tidal Stuff
        </RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
