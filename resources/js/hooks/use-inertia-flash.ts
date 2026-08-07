import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

type FlashBag = {
  message?: string | null;
  success?: string | null;
};

/**
 * Prefer Inertia::flash() (page.flash) over legacy session shared props.flash.
 * Dedupes so the same message does not toast twice on remount.
 */
export function useInertiaFlashToast(
  onFlash: (message: string, kind: 'success' | 'message') => void
): void {
  const page = usePage();
  const pageFlash = (page as { flash?: FlashBag }).flash;
  const propsFlash = (page.props as { flash?: FlashBag }).flash;
  const success = pageFlash?.success ?? propsFlash?.success ?? null;
  const message = pageFlash?.message ?? propsFlash?.message ?? null;
  const last = useRef<string | null>(null);

  useEffect(() => {
    const next = success || message;
    if (!next || next === last.current) {
      return;
    }
    last.current = next;
    onFlash(next, success ? 'success' : 'message');
  }, [success, message, onFlash]);
}
