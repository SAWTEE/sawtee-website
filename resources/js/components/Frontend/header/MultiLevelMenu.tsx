import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import type { MenuItem } from '@/types';

/** Shared Inertia menu tree shape (label, url, nested children). */
export type MultiLevelMenuItem = MenuItem;

export function isExternalUrl(url: string): boolean {
  return (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  );
}

type MenuLinkProps = {
  item: MultiLevelMenuItem;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'>;

const MenuLink = forwardRef<HTMLAnchorElement, MenuLinkProps>(function MenuLink(
  { item, className, ...slotProps },
  ref
) {
  const linkClass = cn(
    'cursor-pointer font-medium leading-none no-underline',
    className
  );

  if (isExternalUrl(item.url)) {
    return (
      <a
        ref={ref}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        {...slotProps}
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={item.url}
      className={linkClass}
      {...(slotProps as ComponentPropsWithoutRef<typeof Link>)}
    >
      {item.title}
    </Link>
  );
});
MenuLink.displayName = 'MenuLink';

function itemKey(item: MultiLevelMenuItem, index: number): string {
  if (item.id != null) {
    return String(item.id);
  }
  return `${item.title}-${item.url}-${index}`;
}

function hasChildren(item: MultiLevelMenuItem): boolean {
  return (item.children?.length ?? 0) > 0;
}

type MultiLevelMenuItemsProps = {
  items: MultiLevelMenuItem[];
  /** When true, branch nodes include a link to their own URL above their children. */
  includeBranchLinks?: boolean;
};

/**
 * Recursive menu rows for arbitrary depth (DropdownMenu Sub nesting).
 * Desktop-oriented; mobile nav keeps its Collapsible accordion.
 */
export function MultiLevelMenuItems({
  items,
  includeBranchLinks = true,
}: MultiLevelMenuItemsProps) {
  return (
    <>
      {items.map((item, index) => {
        const key = itemKey(item, index);

        if (hasChildren(item)) {
          return (
            <DropdownMenuSub key={key}>
              <DropdownMenuSubTrigger className="focus:bg-bgDarker data-[state=open]:bg-bgDarker font-medium dark:focus:bg-neutral-800 dark:data-[state=open]:bg-neutral-800">
                {item.title}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-popover min-w-56 border p-1 shadow-lg">
                  {includeBranchLinks && item.url ? (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="focus:bg-bgDarker dark:focus:bg-neutral-800"
                      >
                        <MenuLink item={item} />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : null}
                  <MultiLevelMenuItems
                    items={item.children ?? []}
                    includeBranchLinks={includeBranchLinks}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        }

        return (
          <DropdownMenuItem
            key={key}
            asChild
            className="focus:bg-bgDarker dark:focus:bg-neutral-800"
          >
            <MenuLink item={item} />
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

const triggerBaseClassName =
  'group relative inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium outline-none transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground dark:text-white';

export type MultiLevelMenuProps = {
  /** Parent item: label drives the trigger; `children` form the dropdown tree. */
  item: MultiLevelMenuItem;
  triggerClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
  /** Open on pointer hover (desktop nav). Keyboard still uses click/focus. */
  openOnHover?: boolean;
  /** Uncontrolled initial open state (useful in tests). */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Controlled open-change handler. */
  onOpenChange?: (_open: boolean) => void;
  /** Optional overlay inside the trigger (e.g. nav focus highlight). */
  triggerAddon?: ReactNode;
  /** Include a top-level link to the parent URL inside the panel. */
  includeParentLink?: boolean;
};

/**
 * Reusable multilevel dropdown for header (and similar) navigation.
 * Driven by the shared Inertia menu tree — not Publications-specific.
 *
 * Desktop-only interaction model (hover + keyboard). Mobile uses the
 * Collapsible accordion in `mobileMenu` with the same menu data.
 */
export default function MultiLevelMenu({
  item,
  triggerClassName,
  contentClassName,
  align = 'start',
  openOnHover = true,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  triggerAddon,
  includeParentLink = true,
}: MultiLevelMenuProps) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer, setOpen]);

  const handleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer, setOpen]);

  // Clear sticky focus/open styles when a parent forces the menu closed
  // (e.g. another top-level nav item becomes active).
  useEffect(() => {
    if (open) {
      return;
    }
    clearCloseTimer();
    const trigger = triggerRef.current;
    if (trigger && document.activeElement === trigger) {
      trigger.blur();
    }
  }, [open, clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const children = item.children ?? [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        asChild
        onPointerEnter={openOnHover ? handleOpen : undefined}
        onPointerLeave={openOnHover ? handleClose : undefined}
      >
        <button
          ref={triggerRef}
          type="button"
          className={cn(triggerBaseClassName, triggerClassName)}
          aria-haspopup="menu"
        >
          {item.title}
          <ChevronDown
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
          {triggerAddon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={6}
        className={cn(
          'bg-popover text-popover-foreground z-50 min-w-56 border p-1 shadow-md',
          contentClassName
        )}
        onPointerEnter={openOnHover ? handleOpen : undefined}
        onPointerLeave={openOnHover ? handleClose : undefined}
      >
        {includeParentLink && item.url ? (
          <>
            <DropdownMenuItem
              asChild
              className="focus:bg-bgDarker dark:focus:bg-neutral-800"
            >
              <MenuLink item={item} />
            </DropdownMenuItem>
            {children.length > 0 ? <DropdownMenuSeparator /> : null}
          </>
        ) : null}
        <MultiLevelMenuItems items={children} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
