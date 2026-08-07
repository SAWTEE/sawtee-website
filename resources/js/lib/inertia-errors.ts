import { router } from '@inertiajs/react';

import { toast } from '@/hooks/use-toast';

const UPLOAD_FAILURE_MESSAGE =
  'Something went wrong while saving. If you uploaded an image, try a smaller JPEG/PNG/WebP (max 2MB) and submit again.';

let registered = false;

/**
 * Prevent Inertia's blank white error dialog for non-Inertia / fatal HTTP
 * responses (e.g. PHP OOM during image conversion) and surface a toast instead.
 */
export function registerInertiaErrorHandlers(): void {
  if (registered || typeof window === 'undefined') {
    return;
  }

  registered = true;

  router.on('httpException', event => {
    event.preventDefault();

    const status = event.detail.response?.status;
    const path = window.location.pathname;
    const looksLikeUpload =
      /posts|articles|publications|research|categories|pages|sections|teams|fellows|slides|published-stories/i.test(
        path
      ) && !/maintenance/i.test(path);

    toast({
      variant: 'destructive',
      title: status && status >= 500 ? 'Server error' : 'Request failed',
      description:
        status && status >= 500
          ? looksLikeUpload
            ? UPLOAD_FAILURE_MESSAGE
            : 'Something went wrong on the server. Please try again or check the logs.'
          : 'Something went wrong. Please try again.',
    });
  });

  router.on('networkError', event => {
    event.preventDefault();

    toast({
      variant: 'destructive',
      title: 'Network error',
      description:
        'Could not reach the server. Check your connection and try again.',
    });
  });
}
