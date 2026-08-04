/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare function route(
  name?: string,
  params?: unknown,
  absolute?: boolean,
  config?: unknown
): string;
