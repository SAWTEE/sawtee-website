import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

createServer(page =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: title => `${title} - ${appName}`,
    resolve: name =>
      resolvePageComponent(
        `./Pages/${name}.tsx`,
        import.meta.glob('./Pages/**/*.tsx')
      ),
    setup: ({ App, props }) => {
      const ziggy = (page.props as { ziggy?: Record<string, unknown> }).ziggy ?? {};

      // @ts-expect-error Ziggy route helper assigned for SSR
      global.route = (name, params, absolute) =>
        ziggyRoute(name, params, absolute, {
          ...ziggy,
          location: new URL(String(ziggy.location ?? '')),
        });

      return <App {...props} />;
    },
  })
);
