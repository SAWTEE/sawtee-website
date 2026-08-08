/**
 * Register the production service worker at the site root.
 *
 * The SW file is copied to /sw.js after the Vite client build so scope `/`
 * works on Herd (nginx) and cPanel (Apache) without Service-Worker-Allowed.
 * Admin, auth, and Inertia document caching are excluded in Workbox config.
 */
export function registerPwa(): void {
  if (!import.meta.env.PROD || typeof navigator === 'undefined') {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;

          if (!worker) {
            return;
          }

          worker.addEventListener('statechange', () => {
            if (
              worker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              showUpdateBanner(() => {
                worker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              });
            }
          });
        });
      })
      .catch(() => {
        // Registration failures are non-fatal (unsupported origin, etc.).
      });
  });
}

function showUpdateBanner(onRefresh: () => void): void {
  if (document.getElementById('pwa-update-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'pwa-update-banner';
  banner.setAttribute('role', 'status');
  banner.style.cssText = [
    'position:fixed',
    'z-index:9999',
    'left:1rem',
    'right:1rem',
    'bottom:1rem',
    'margin:0 auto',
    'max-width:28rem',
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'gap:0.75rem',
    'padding:0.85rem 1rem',
    'border-radius:0.4rem',
    'background:#006181',
    'color:#fff',
    'font:600 0.9rem/1.35 system-ui,-apple-system,sans-serif',
    'box-shadow:0 8px 24px rgba(15,23,42,0.18)',
  ].join(';');

  const message = document.createElement('span');
  message.textContent = 'A new version is available.';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Refresh';
  button.style.cssText = [
    'cursor:pointer',
    'border:0',
    'border-radius:0.3rem',
    'padding:0.45rem 0.85rem',
    'background:#fff',
    'color:#006181',
    'font:600 0.85rem/1 system-ui,-apple-system,sans-serif',
  ].join(';');
  button.addEventListener('click', onRefresh);

  banner.append(message, button);
  document.body.append(banner);
}
