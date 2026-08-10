import { Link } from '@inertiajs/react';
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from 'react';

export type InertiaLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /**
   * Prefer true for same-page filters/pagination so local UI state is kept.
   * Leave false (default) when navigating to a different page that should remount.
   */
  preserveState?: boolean | 'errors';
};

/**
 * Site navigation Link with View Transitions enabled by default.
 * Pass `viewTransition={false}` to opt out for a single link.
 */
const InertiaLink = forwardRef<ElementRef<typeof Link>, InertiaLinkProps>(
  function InertiaLink(
    { viewTransition = true, preserveScroll, preserveState, ...props },
    ref
  ) {
    return (
      <Link
        ref={ref}
        viewTransition={viewTransition}
        preserveScroll={preserveScroll}
        preserveState={preserveState}
        {...props}
      />
    );
  }
);

InertiaLink.displayName = 'InertiaLink';

export default InertiaLink;
