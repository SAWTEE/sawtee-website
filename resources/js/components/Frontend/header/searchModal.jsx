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
import { Separator } from '@radix-ui/react-dropdown-menu';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    router.visit(`/search`, {
      data: { query: searchQuery, page: 1 },
    });
    setIsOpen(false);
  }

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === '/' && !isOpen) {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        setSearchQuery(null);
      }}
    >
      <div className="text-center">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="relative inline-flex w-full max-w-xs items-center justify-between whitespace-nowrap rounded-lg border py-3.5 pl-4 pr-3 text-sm"
          >
            <div className="flex items-center justify-center">
              <svg
                className="mr-3 h-4 w-4 shrink-0 fill-slate-500"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Search</title>
                <path d="m14.707 13.293-1.414 1.414-2.4-2.4 1.414-1.414 2.4 2.4ZM6.8 12.6A5.8 5.8 0 1 1 6.8 1a5.8 5.8 0 0 1 0 11.6Zm0-2a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
              </svg>
              <span>{'Press / or CTRL k to search'}</span>
            </div>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className={cn('max-w-lg dark:text-white')}>
        <DialogHeader className={'px-6'}>
          <DialogTitle>
            <SearchIcon className="inline-flex h-4 w-4 shrink-0" />
            {' Search'}
          </DialogTitle>
          <DialogDescription>
            {'Start typing to search the website'}
          </DialogDescription>
          <form onSubmit={handleSubmit} className="">
            <div className="flex items-center gap-2">
              <VisuallyHidden.Root>
                <label htmlFor="search-modal">Search</label>
              </VisuallyHidden.Root>

              <Input
                id="search-modal"
                className="[&::-webkit-search-decoration]:none placeholder-text-muted-foreground w-full appearance-none border bg-bgDarker py-3 text-sm"
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Separator className="border border-b-2" />
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
