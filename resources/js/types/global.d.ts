import type { SharedProps } from './index';

export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  function route(
    _name?: string,
    _params?: Record<string, unknown> | unknown,
    _absolute?: boolean,
    _config?: unknown
  ): string;

  interface Window {
    axios: typeof import('axios').default;
  }
}

declare module '@inertiajs/react' {
  interface PageProps extends SharedProps {}
}
