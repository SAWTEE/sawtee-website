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
import {
  sanitizeSearchQuery,
  SEARCH_QUERY_MAX_LENGTH,
} from '@/lib/search-params';
import { useSiteCopy } from '@/lib/site-copy';
import { cn } from '@/lib/utils';

export default function SearchModal() {
  const copy = useSiteCopy();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const trimmedQuery = sanitizeSearchQuery(searchQuery);

  function goToSearch(query: string) {
    const term = sanitizeSearchQuery(query);
    if (!term) {
      inputRef.current?.focus();
      return;
    }

    router.visit(`/search`, {
      data: { query: term, page: 1 },
      viewTransition: true,
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
        tag === 'input' || tag === 'textarea' || target?.isContentEditable;

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
            'text-muted-foreground hover:text-primary border-theme-600/15 relative inline-flex h-10 max-w-xs items-center justify-between gap-3 rounded-md border bg-transparent px-3 text-sm font-normal shadow-none transition-colors',
            'hover:border-theme-600/35 hover:bg-theme-600/5',
            'dark:border-theme-600/30 dark:hover:border-theme-600/45 dark:hover:bg-theme-600/10'
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <SearchIcon className="text-theme-600 dark:text-theme-450 h-4 w-4 shrink-0" />
            <span className="truncate">{copy.search.button_label}</span>
          </span>
          <kbd className="text-muted-foreground border-theme-600/15 bg-theme-600/5 dark:border-theme-600/30 dark:bg-theme-600/15 pointer-events-none hidden items-center gap-1 rounded border px-1.5 py-0.5 font-sans text-xs font-medium tracking-wide sm:inline-flex">
            <span className="text-xs">/</span>
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="border-theme-600/15 dark:border-theme-600/30 gap-0 overflow-hidden border p-0 shadow-xl sm:max-w-xl">
        <DialogHeader className="border-theme-600/10 dark:border-theme-600/20 space-y-1 border-b px-5 pt-5 pb-4 text-left">
          <DialogTitle className="text-primary dark:text-foreground font-serif text-xl font-semibold tracking-tight">
            {copy.search.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            {copy.search.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-2">
          <label htmlFor={inputId} className="sr-only">
            {copy.search.input_label}
          </label>
          <div className="relative">
            <SearchIcon
              className="text-theme-600 dark:text-theme-450 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              ref={inputRef}
              id={inputId}
              type="search"
              autoComplete="off"
              maxLength={SEARCH_QUERY_MAX_LENGTH}
              placeholder={copy.search.placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={cn(
                '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
                'border-theme-600/20 h-12 w-full appearance-none rounded-md border bg-transparent py-3 pr-4 pl-10 text-base shadow-none',
                'placeholder:text-muted-foreground/80',
                'focus-visible:border-theme-600/45 focus-visible:ring-theme-600/30',
                'dark:border-theme-600/35 dark:focus-visible:border-theme-600/55'
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
                'hover:border-theme-600/20 hover:bg-theme-600/6',
                'focus-visible:border-theme-600/35 focus-visible:bg-theme-600/6 focus-visible:ring-theme-600/25 focus-visible:ring-2 focus-visible:outline-none',
                'dark:hover:border-theme-600/35 dark:hover:bg-theme-600/12'
              )}
            >
              <span className="bg-theme-600/10 text-theme-600 dark:bg-theme-600/20 dark:text-theme-450 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <SearchIcon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-muted-foreground block text-xs font-medium tracking-wide uppercase">
                  {copy.search.results_label}
                </span>
                <span className="text-primary dark:text-foreground mt-0.5 block truncate font-serif text-base font-semibold tracking-tight">
                  “{trimmedQuery}”
                </span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {copy.search.press_enter}
                </span>
              </span>
              <ArrowRight
                className="text-muted-foreground group-hover:text-theme-600 dark:group-hover:text-theme-450 mt-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          ) : (
            <div className="border-theme-600/15 dark:border-theme-600/25 rounded-md border border-dashed px-4 py-5">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {copy.search.helper.includes('{examples}')
                  ? copy.search.helper.split('{examples}')[0]
                  : copy.search.helper}{' '}
                {copy.search.examples.map((example, index) => (
                  <span key={example}>
                    {index > 0
                      ? index === copy.search.examples.length - 1
                        ? ', or '
                        : ', '
                      : null}
                    <span className="text-primary/80 dark:text-foreground font-medium">
                      {example}
                    </span>
                  </span>
                ))}
                {copy.search.helper.includes('{examples}')
                  ? copy.search.helper.split('{examples}')[1]
                  : null}
              </p>
            </div>
          )}
        </div>

        <div className="text-muted-foreground border-theme-600/10 bg-theme-600/4 dark:border-theme-600/20 dark:bg-theme-600/10 flex items-center justify-between gap-3 border-t px-5 py-3 text-xs">
          <span className="inline-flex items-center gap-2">
            <kbd className="bg-background border-theme-600/20 dark:border-theme-600/35 rounded border px-1.5 py-0.5 font-sans text-xs">
              Enter
            </kbd>
            <span>to search</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd className="bg-background border-theme-600/20 dark:border-theme-600/35 rounded border px-1.5 py-0.5 font-sans text-xs">
              Esc
            </kbd>
            <span>to close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
