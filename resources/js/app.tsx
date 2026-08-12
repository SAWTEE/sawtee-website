import '../css/index.css';

import { createInertiaApp } from '@inertiajs/react';
import { Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { registerInertiaErrorHandlers } from '@/lib/inertia-errors';
import { resolveDefaultLayout } from '@/lib/resolve-layout';
import { resolvePage } from '@/lib/resolve-page';

const appName = import.meta.env.VITE_APP_NAME ?? 'SAWTEE';

registerInertiaErrorHandlers();

if (import.meta.env.PROD) {
  void import('@/lib/register-pwa').then(({ registerPwa }) => registerPwa());
}

function removeStaticLcpFallback(): void {
  document.body.classList.add('inertia-mounted');
}

createInertiaApp({
  // Custom resolve excludes *.test.tsx / *.spec.tsx from the production graph.
  resolve: name => resolvePage(name),
  layout: name => resolveDefaultLayout(name),
  title: title => `${appName}  | ${title}`,
  defaults: {
    // Only enable View Transitions on real navigations. Applying them to
    // deferred/partial/async reloads can leave `swap()` unresolved and stall
    // sidebar + below-the-fold props on first paint.
    visitOptions: (_href, options) => {
      if (
        options.deferredProps ||
        options.async ||
        (Array.isArray(options.only) && options.only.length > 0) ||
        (Array.isArray(options.except) && options.except.length > 0)
      ) {
        return {};
      }

      return { viewTransition: true };
    },
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
