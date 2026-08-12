import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import type { ComponentType, ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

import { resolveDefaultLayout } from '@/lib/resolve-layout';
import { resolvePage } from '@/lib/resolve-page';

import { route as ziggyRoute } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

createServer(page =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name: string) => resolvePage(name),
    layout: (name: string) => resolveDefaultLayout(name),
    title: (title: string) => `${title} - ${appName}`,
    setup({
      App,
      props,
    }: {
      App: ComponentType<Record<string, unknown>>;
      props: Record<string, unknown>;
    }): ReactElement {
      const ziggy =
        (page.props as { ziggy?: Record<string, unknown> }).ziggy ?? {};

      // Ziggy SSR helper for page components.
      (globalThis as any).route = (name: any, params: any, absolute: any) =>
        ziggyRoute(name, params, absolute, {
          ...ziggy,
          location: new URL(String(ziggy.location ?? '')),
        } as any);

      return <App {...props} />;
    },
  } as never)
);
