import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ArrowRight, SearchIcon } from 'lucide-react';
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const trimmedQuery = searchQuery.trim();

  function goToSearch(query: string) {
    const term = query.trim();
    if (!term) {
      inputRef.current?.focus();
      return;
    }

    router.visit(`/search`, {
      data: { query: term, page: 1 },
    });
    setIsOpen(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    goToSearch(searchQuery);
  }

  function handlePreviewKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToSearch(searchQuery);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable;

      if (event.key === '/' && !isOpen && !isTyping) {
        event.preventDefault();
        setIsOpen(true);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) {
          setSearchQuery('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          aria-label="Open search"
          className={cn(
            'text-muted-foreground hover:text-primary relative inline-flex h-10 max-w-xs items-center justify-between gap-3 rounded-md border border-[#006181]/15 bg-transparent px-3 text-sm font-normal shadow-none transition-colors',
            'hover:border-[#006181]/35 hover:bg-[#006181]/5',
            'dark:border-[#006181]/30 dark:hover:border-[#006181]/45 dark:hover:bg-[#006181]/10'
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <SearchIcon className="h-4 w-4 shrink-0 text-[#006181] dark:text-[#4da3c0]" />
            <span className="truncate">Search</span>
          </span>
          <kbd className="text-muted-foreground pointer-events-none hidden items-center gap-1 rounded border border-[#006181]/15 bg-[#006181]/5 px-1.5 py-0.5 font-sans text-[10px] font-medium tracking-wide sm:inline-flex dark:border-[#006181]/30 dark:bg-[#006181]/15">
            <span className="text-xs">/</span>
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'gap-0 overflow-hidden border border-[#006181]/15 p-0 shadow-xl sm:max-w-xl dark:border-[#006181]/30',
          'data-[state=open]:slide-in-from-top-[12%]'
        )}
      >
        <DialogHeader className="space-y-1 border-b border-[#006181]/10 px-5 pt-5 pb-4 text-left dark:border-[#006181]/20">
          <DialogTitle className="text-primary font-serif text-xl font-semibold tracking-tight dark:text-zinc-100">
            Search
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Find research, publications, news, and resources across SAWTEE.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-2">
          <label htmlFor={inputId} className="sr-only">
            Search the website
          </label>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#006181] dark:text-[#4da3c0]"
              aria-hidden
            />
            <Input
              ref={inputRef}
              id={inputId}
              type="search"
              autoComplete="off"
              placeholder="Search the site…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={cn(
                '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
                'h-12 w-full appearance-none rounded-md border border-[#006181]/20 bg-transparent py-3 pr-4 pl-10 text-base shadow-none',
                'placeholder:text-muted-foreground/80',
                'focus-visible:border-[#006181]/45 focus-visible:ring-[#006181]/30',
                'dark:border-[#006181]/35 dark:focus-visible:border-[#006181]/55'
              )}
            />
          </div>
        </form>

        <div className="px-5 pt-1 pb-4" aria-live="polite">
          {trimmedQuery ? (
            <button
              type="button"
              onClick={() => goToSearch(searchQuery)}
              onKeyDown={handlePreviewKeyDown}
              className={cn(
                'group flex w-full items-start gap-3 rounded-md border border-transparent px-3 py-3 text-left transition-colors',
                'hover:border-[#006181]/20 hover:bg-[#006181]/6',
                'focus-visible:border-[#006181]/35 focus-visible:bg-[#006181]/6 focus-visible:ring-2 focus-visible:ring-[#006181]/25 focus-visible:outline-none',
                'dark:hover:border-[#006181]/35 dark:hover:bg-[#006181]/12'
              )}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006181]/10 text-[#006181] dark:bg-[#006181]/20 dark:text-[#4da3c0]">
                <SearchIcon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
                  Search results
                </span>
                <span className="text-primary mt-0.5 block truncate font-serif text-base font-semibold tracking-tight dark:text-zinc-100">
                  “{trimmedQuery}”
                </span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  Press Enter to view matching pages
                </span>
              </span>
              <ArrowRight
                className="text-muted-foreground mt-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[#006181] dark:group-hover:text-[#4da3c0]"
                aria-hidden
              />
            </button>
          ) : (
            <div className="rounded-md border border-dashed border-[#006181]/15 px-4 py-5 dark:border-[#006181]/25">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Try a theme, publication title, or keyword — for example{' '}
                <span className="text-primary/80 font-medium dark:text-zinc-200">
                  trade
                </span>
                ,{' '}
                <span className="text-primary/80 font-medium dark:text-zinc-200">
                  climate
                </span>
                , or{' '}
                <span className="text-primary/80 font-medium dark:text-zinc-200">
                  LDC
                </span>
                .
              </p>
            </div>
          )}
        </div>

        <div className="text-muted-foreground flex items-center justify-between gap-3 border-t border-[#006181]/10 bg-[#006181]/4 px-5 py-3 text-xs dark:border-[#006181]/20 dark:bg-[#006181]/10">
          <span className="inline-flex items-center gap-2">
            <kbd className="rounded border border-[#006181]/20 bg-background px-1.5 py-0.5 font-sans text-[10px] dark:border-[#006181]/35">
              Enter
            </kbd>
            <span>to search</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd className="rounded border border-[#006181]/20 bg-background px-1.5 py-0.5 font-sans text-[10px] dark:border-[#006181]/35">
              Esc
            </kbd>
            <span>to close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
