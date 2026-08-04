import type { SharedProps } from './index';
import type { CSSProperties, ReactNode } from 'react';

export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  function route(
    name?: string,
    params?: Record<string, unknown> | unknown,
    absolute?: boolean,
    config?: unknown
  ): string;

  interface Window {
    axios: typeof import('axios').default;
  }

  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          init?: string | boolean;
          navigation?: string | boolean;
          pagination?: string | boolean;
          scrollbar?: string | boolean;
          class?: string;
          style?: CSSProperties;
        },
        HTMLElement
      >;
      'swiper-slide': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          class?: string;
          style?: CSSProperties;
          children?: ReactNode;
        },
        HTMLElement
      >;
    }
  }
}

declare module '@inertiajs/react' {
  interface PageProps extends SharedProps {}
}
