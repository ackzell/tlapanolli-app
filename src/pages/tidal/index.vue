<script setup lang="ts">
import { initializeLogin, logout } from '@tidal-music/auth';
import { onMounted, ref } from 'vue';

import { createTidalClient, initTidal } from '@/lib/tidalClient';

const user = ref();

type TidalAPIClient = Awaited<ReturnType<typeof createTidalClient>>;

let apiClient: TidalAPIClient;

const isTidalUserLoggedIn = ref(false);

onMounted(async () => {
  apiClient = await createTidalClient();
  await checkTidalLoginState();
});

async function loginWithTidal() {
  await initTidal();
  const redirectUri = await initializeLogin({
    redirectUri: import.meta.env.VITE_TIDAL_REDIRECT_URI,
  });

  window.location.href = redirectUri;
}

async function checkTidalLoginState() {
  let isLoggedIn = false;

  // ! for some reason the TIDAL sdk
  // ALWAYS returns credentials even if the user is logged out

  // try {
  //   const tidalCredentials = await credentialsProvider.getCredentials();
  //   console.log('credentials', tidalCredentials);
  //   if (tidalCredentials.token) {
  //     isLoggedIn = true;
  //   }
  // }
  // catch (error) {
  //   console.error('NOT LOGGED IN YET', error);

  //   const cookies = document.cookie.split(';');

  //   console.log('cookies', cookies);

  //   isLoggedIn = false;
  // }

  isLoggedIn = localStorage.getItem('tidal-user-logged-in') === 'true';

  isTidalUserLoggedIn.value = isLoggedIn;

  console.log('is logged in', isLoggedIn);
  return isLoggedIn;
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
  localStorage.setItem('tidal-user-logged-in', 'false');
  isTidalUserLoggedIn.value = false;
}
</script>

<template>
  <h1>Tidal</h1>

  <section flex gap-2>
    <button btn @click="checkTidalLoginState()">
      Is user logged in?
    </button>

    <div v-if="isTidalUserLoggedIn">
      <button btn @click="getMyUser">
        Get my user
      </button>

      <button btn @click="logMeOut">
        Log out Tidal
      </button>
    </div>

    <div v-else>
      <button btn @click="loginWithTidal">
        Login with Tidal
      </button>
    </div>
  </section>

  <pre>{{ user }}</pre>
</template>
