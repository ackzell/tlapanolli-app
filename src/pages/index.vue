<script setup lang="ts">
import { inject } from 'vue';

import { authClientKey } from '@/types/InjectionKeys';

const { client } = inject(authClientKey)!;

async function loginWithSpotify() {
  const authorizationUrl = await client.authorizationCode.getAuthorizeUri({
    // URL in the app that the user should get redirected to after authenticating
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,

    // Optional string that can be sent along to the auth server. This value will
    // be sent along with the redirect back to the app verbatim.
    state: 'some-string',

    // codeVerifier,

    scope: import.meta.env.VITE_SPOTIFY_SCOPE.split(','),

  });
  window.location.href = authorizationUrl;
}
</script>

<template>
  <div>
    <button @click="loginWithSpotify">
      Login with Spotify
    </button>
  </div>
</template>
