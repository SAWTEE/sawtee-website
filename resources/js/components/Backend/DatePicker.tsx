import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateTimeForInput } from '@/lib/helpers';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  id?: string;
  value?: string | Date | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  /** Keep time when formatting for Laravel datetime columns. */
  withTime?: boolean;
};

function parseValue(value?: string | Date | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 5,
  className,
  withTime = true,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);

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
          data-empty={!selected}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {selected ? format(selected, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          onSelect={date => {
            if (!date) {
              onChange(null);
              return;
            }

            onChange(
              withTime
                ? formatDateTimeForInput(date)
                : format(date, 'yyyy-MM-dd')
            );
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
