/* eslint-disable ts/consistent-type-definitions */
/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: true;
}

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_SERVER: string;
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_SECRET_ID: string;
  readonly VITE_SPOTIFY_AUTHORIZATION_ENDPOINT: string;
  readonly VITE_SPOTIFY_TOKEN_ENDPOINT: string;
  readonly VITE_SPOTIFY_REDIRECT_URI: string;
  readonly VITE_SPOTIFY_SCOPES: string;
  readonly VITE_TIDAL_CLIENT_ID: string;
  readonly VITE_TIDAL_SECRET_ID: string;
  readonly VITE_TIDAL_REDIRECT_URI: string;
  readonly VITE_TIDAL_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
