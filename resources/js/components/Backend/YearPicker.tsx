import { CalendarIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type YearPickerProps = {
  id?: string;
  value?: number | string | null;
  onChange: (year: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

function toYearNumber(value?: number | string | null): number | null {
  if (value == null || value === '') {
    return null;
  }

  const year = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(year) ? year : null;
}

export default function YearPicker({
  id,
  value,
  onChange,
  placeholder = 'Select year',
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toYearNumber(value);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = toYear; year >= fromYear; year -= 1) {
      list.push(year);
    }
    return list;
  }, [fromYear, toYear]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          data-empty={selected == null}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {selected != null ? selected : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <ScrollArea className="h-64">
          <div className="grid grid-cols-3 gap-1 p-1">
            {years.map(year => {
              const isSelected = selected === year;

              return (
                <Button
                  key={year}
                  type="button"
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 font-normal',
                    isSelected && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => {
                    onChange(year);
                    setOpen(false);
                  }}
                >
                  {year}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
