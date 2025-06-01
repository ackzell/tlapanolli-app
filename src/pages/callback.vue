<script setup lang="ts">
import { inject, onMounted } from 'vue';

import { authClientKey } from '@/types/InjectionKeys';

// obtain the token here

const { client, codeVerifier } = inject(authClientKey)!;

onMounted(async () => {
  console.log(window.location.href, { client, codeVerifier });

  const token = await client.authorizationCode.getTokenFromCodeRedirect(
  // current uri
    window.location.href,
    {
      /**
       * The redirect URI is not actually used for any redirects, but MUST be the
       * same as what you passed earlier to "authorizationCode"
       */
      redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,

      /**
       * This is optional, but if it's passed then it also MUST be the same as
       * what you passed in the first step.
       *
       * If set, it will verify that the server sent the exact same state back.
       */
      state: 'some-string',

      // codeVerifier,

    },

  );
  console.log({ token });
});
</script>

<template>
  this is the callback!
</template>
