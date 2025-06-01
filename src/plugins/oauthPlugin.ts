import type { App } from 'vue';

import { generateCodeVerifier, OAuth2Client } from '@badgateway/oauth2-client';

import { authClientKey } from '@/types/InjectionKeys';

export default {
  async install(app: App) {
    const codeVerifier = await generateCodeVerifier();

    console.log('installing oauth plugin...');

    const client = new OAuth2Client({
      server: import.meta.env.VITE_SPOTIFY_SERVER,
      clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      clientSecret: import.meta.env.VITE_SPOTIFY_SECRET_ID,
      authorizationEndpoint: import.meta.env.VITE_SPOTIFY_AUTHORIZATION_ENDPOINT,
      tokenEndpoint: import.meta.env.VITE_SPOTIFY_TOKEN_ENDPOINT,
    });

    console.log({ client, codeVerifier });

    app.provide(authClientKey, { client, codeVerifier });
  },
};
