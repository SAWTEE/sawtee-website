import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

createServer(page =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: title => `${title} - ${appName}`,
    resolve: name => {
      const pages = import.meta.glob<ResolvedComponent>('./Pages/**/*.tsx');
      const importPage = pages[`./Pages/${name}.tsx`];

      if (!importPage) {
        throw new Error(`Page not found: ./Pages/${name}.tsx`);
      }

      return importPage();
    },
    setup: ({ App, props }) => {
      const ziggy = (page.props as { ziggy?: Record<string, unknown> }).ziggy ?? {};

      // Ziggy SSR helper for page components.
      (globalThis as any).route = (name: any, params: any, absolute: any) =>
        ziggyRoute(name, params, absolute, {
          ...ziggy,
          location: new URL(String(ziggy.location ?? '')),
        } as any);

      return <App {...props} />;
    },
  })
);
