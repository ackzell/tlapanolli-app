<script setup lang="ts">
import { credentialsProvider, initializeLogin, logout } from '@tidal-music/auth';
import { onMounted, ref } from 'vue';

import { initTidal } from '@/lib/tidalClient';

const user = ref();

type TidalAPIClient = Awaited<ReturnType<typeof initTidal>>;

let apiClient: TidalAPIClient;

onMounted(async () => {
  apiClient = await initTidal();
});

async function loginWithTidal() {
  const redirectUri = await initializeLogin({
    redirectUri: import.meta.env.VITE_TIDAL_REDIRECT_URI,
  });

  window.location.href = redirectUri;
}

async function isUserLoggedIn() {
  try {
    console.log('credentials', await credentialsProvider.getCredentials());
  } catch (error) {
    console.error('NOT LOGGED IN YET', error);
  }
  
}

async function getMyUser() {

  const currentUser = await apiClient.GET('/users/me');

  console.log('current user', currentUser);

  user.value = currentUser;
  // user.value = await apiClient.GET('/playlists/me', {
  //   params: {
  //     query: {
  //       countryCode: 'MX',
  //       locale: 'es_MX',
  //       include: ['artist', 'album', 'track'],
  //     }
  //   },
  // });
}

async function logMeOut() {
  logout();
}
</script>

<template>
  <h1>Tidal</h1>

  <section flex gap-2>

    <button btn @click="isUserLoggedIn">
      Is user logged in?
    </button>

    <button btn @click="loginWithTidal">
      Login with Tidal
    </button>

    <button btn @click="logMeOut">
      Log out Tidal
    </button>

    <button btn @click="getMyUser">
      Get my user
    </button>
  </section>

  <pre>{{ user }}</pre>
</template>
