import type { OAuth2Client } from '@badgateway/oauth2-client';
import type { InjectionKey } from 'vue';

export type AuthClient = {
  client: OAuth2Client;
  codeVerifier: string;
};

export const authClientKey: InjectionKey<AuthClient> = Symbol('authClient');
