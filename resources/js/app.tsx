import '../css/index.css';

import { createInertiaApp } from '@inertiajs/react';
import { Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { registerInertiaErrorHandlers } from '@/lib/inertia-errors';
import { resolveDefaultLayout } from '@/lib/resolve-layout';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

registerInertiaErrorHandlers();

if (import.meta.env.PROD) {
  void import('@/lib/register-pwa').then(({ registerPwa }) => registerPwa());
}

function removeStaticLcpFallback(): void {
  document.body.classList.add('inertia-mounted');
}

createInertiaApp({
  // Resolved by @inertiajs/vite into a lazy import.meta.glob (code-split per page).
  pages: {
    path: './Pages',
    extension: '.tsx',
    lazy: true,
  },
  layout: name => resolveDefaultLayout(name),
  title: title => `${appName}  | ${title}`,
  defaults: {
    visitOptions: (_href, _options) => ({
      viewTransition: true,
    }),
  },
  setup({ el, App, props }) {
    if (!el) {
      throw new Error('Inertia root element not found');
    }

    const app = (
      <Suspense fallback={null}>
        <App {...props} />
      </Suspense>
    );

    if (el.hasChildNodes()) {
      hydrateRoot(el, app);
      removeStaticLcpFallback();
      return;
    }

    createRoot(el).render(app);
    removeStaticLcpFallback();
  },
  progress: {
    delay: 250,
    color: '#006181',
    includeCSS: true,
    showSpinner: false,
  },
});
