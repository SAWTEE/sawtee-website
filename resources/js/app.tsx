// @ts-nocheck
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/index.css';
import './bootstrap';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

createInertiaApp({
  title: title => `${appName}  | ${title}`,
  resolve: name => {
    const pages = import.meta.glob<ResolvedComponent>('./Pages/**/*.tsx');
    const importPage = pages[`./Pages/${name}.tsx`];

    if (!importPage) {
      throw new Error(`Page not found: ./Pages/${name}.tsx`);
    }

    return importPage();
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    delay: 250,
    color: '#006181',
    includeCSS: true,

    // Whether the NProgress spinner will be shown...
    showSpinner: false,
  },
});
