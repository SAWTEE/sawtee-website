import { cva } from 'class-variance-authority';
import { ChevronDown, XCircle, XIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';
/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const MultiSelect = React.forwardRef(
  (
    {
      options,
      onValueChange,
      setValues,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      modalPopover = true,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState(defaultValue);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(selectedValues);
      }
    }, [defaultValue, selectedValues]);

    const toggleOption = value => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v.value !== value.value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      setValues(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
      setValues([]);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      setValues(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        setSelectedValues(options);
        onValueChange(options);
        setValues(options);
      }
    };

    return (
      <div {...props} className={cn('flex flex-col gap-4', className)}>
        <div
          className={cn(
            'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit'
          )}
        >
          {selectedValues?.length > 0 ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center">
                {selectedValues?.slice(0, maxCount).map(value => {
                  const option = options?.find(
                    opt => opt.value === value.value
                  );

                  return (
                    <Badge
                      key={Math.random() + option.value}
                      className={cn(
                        isAnimating ? 'animate-bounce' : '',
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {option?.label}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={event => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      />
                    </Badge>
                  );
                })}
                {selectedValues.length > maxCount && (
                  <Badge
                    className={cn(
                      'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                      isAnimating ? 'animate-bounce' : '',
                      multiSelectVariants({ variant })
                    )}
                    style={{ animationDuration: `${animation}s` }}
                  >
                    {`+ ${selectedValues.length - maxCount} more`}
                    <XCircle
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={event => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    />
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <XIcon
                  className="mx-2 h-4 cursor-pointer text-muted-foreground"
                  onClick={event => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="mx-3 text-sm text-muted-foreground">
                No tags selected
              </span>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center justify-between"
            >
              <span className="mx-3 text-sm text-muted-foreground">
                {placeholder}
              </span>
              <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              key="all"
              onCheckedChange={toggleAll}
              checked={
                selectedValues && selectedValues?.length === options.length
              }
              className="cursor-pointer"
            >
              Select All
            </DropdownMenuCheckboxItem>
            {options?.map(option => {
              const selected = selectedValues.find(
                v => v.value === option.value
              );
              return (
                <DropdownMenuCheckboxItem
                  key={Math.random() + option.value}
                  checked={selected !== undefined}
                  onCheckedChange={() => toggleOption(option)}
                  className="cursor-pointer"
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
