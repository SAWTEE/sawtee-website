import '../css/index.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { registerInertiaErrorHandlers } from '@/lib/inertia-errors';
import { registerPwa } from '@/lib/register-pwa';
import { resolveDefaultLayout } from '@/lib/resolve-layout';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

registerInertiaErrorHandlers();
registerPwa();

createInertiaApp({
  // Resolved by @inertiajs/vite into a lazy import.meta.glob (code-split per page).
  pages: {
    path: './Pages',
    extension: '.tsx',
    lazy: true,
  },
  layout: name => resolveDefaultLayout(name),
  title: title => `${appName}  | ${title}`,
  setup({ el, App, props }) {
    if (!el) {
      throw new Error('Inertia root element not found');
    }

    if (el.hasChildNodes()) {
      hydrateRoot(el, <App {...props} />);
      return;
    }

    createRoot(el).render(<App {...props} />);
  },
  progress: {
    delay: 250,
    color: '#006181',
    includeCSS: true,
    showSpinner: false,
  },
});
