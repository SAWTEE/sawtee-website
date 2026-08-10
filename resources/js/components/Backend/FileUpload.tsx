import { FileIcon, Trash2Icon, UploadIcon, XIcon } from 'lucide-react';
import { type ChangeEvent, useId, useRef, useState } from 'react';

import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { humanFileSize } from '@/lib/form-errors';
import { cn } from '@/lib/utils';

export type UploadProgress =
  | {
      percentage?: number | null;
    }
  | null
  | undefined;

export type ExistingFile = {
  id?: number | string;
  name: string;
  url?: string | null;
  size?: number | null;
};

type FileUploadProps = {
  id?: string;
  name?: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  /** Reject files larger than this many megabytes. Omit or 0 to disable. */
  maxSizeMB?: number;
  /** Newly selected File(s) for the form. */
  value?: File | File[] | null;
  /** Already-stored media shown on edit screens. */
  existing?: ExistingFile | ExistingFile[] | null;
  /** Inertia `progress` from useForm while submitting. */
  progress?: UploadProgress;
  /**
   * True while the parent form request is in flight. Shows the bar before the
   * first XHR progress event (common on fast local uploads).
   */
  uploading?: boolean;
  onChange: (file: File | File[] | null) => void;
  /**
   * Update the controlled `existing` list after removing one stored file.
   * Required for multi-file edit UIs so a single remove does not clear all.
   */
  onExistingChange?: (files: ExistingFile[]) => void;
  /** Clear newly selected and/or mark existing media for removal. */
  onRemove?: () => void;
  hint?: string;
};

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function fileLabel(file: File | ExistingFile): string {
  return 'name' in file && typeof file.name === 'string'
    ? file.name
    : 'Selected file';
}

export default function FileUpload({
  id,
  name,
  label,
  accept = '.pdf,.doc,.docx,.ppt,.pptx',
  multiple = false,
  disabled = false,
  className,
  error,
  maxSizeMB,
  value = null,
  existing = null,
  progress = null,
  uploading = false,
  onChange,
  onExistingChange,
  onRemove,
  hint,
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const selected = asArray(value);
  const stored = asArray(existing);
  const hasSelection = selected.length > 0;
  const hasExisting = !hasSelection && stored.length > 0;
  const showing = hasSelection ? selected : stored;
  const percentage = progress?.percentage ?? null;
  const showProgress = percentage != null || (uploading && hasSelection);
  const displayPercentage = percentage ?? 0;
  const isUploading =
    (uploading && hasSelection) || (percentage != null && percentage < 100);
  const displayError = error || localError || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      setLocalError(null);
      onChange(null);
      return;
    }

    const selectedFiles = Array.from(files);
    if (maxSizeMB != null && maxSizeMB > 0) {
      const tooLarge = selectedFiles.find(
        file => file.size > maxSizeMB * 1024 * 1024
      );
      if (tooLarge) {
        setLocalError(`File must be ${maxSizeMB}MB or smaller.`);
        event.target.value = '';
        return;
      }
    }

    setLocalError(null);
    if (multiple) {
      onChange(selectedFiles);
    } else {
      onChange(selectedFiles[0] ?? null);
    }
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveAll = () => {
    clearInput();
    setLocalError(null);
    onChange(null);
    onExistingChange?.([]);
    onRemove?.();
  };

  const handleRemoveOne = (index: number) => {
    if (hasSelection) {
      if (!multiple) {
        clearInput();
        onChange(null);
        onRemove?.();
        return;
      }

      const next = selected.filter((_, i) => i !== index);
      clearInput();
      onChange(next.length ? next : null);
      if (!next.length) {
        onRemove?.();
      }
      return;
    }

    // Showing already-stored files on edit screens.
    if (!multiple || stored.length <= 1) {
      handleRemoveAll();
      return;
    }

    const nextExisting = stored.filter((_, i) => i !== index);
    if (!nextExisting.length) {
      handleRemoveAll();
      return;
    }

    if (onExistingChange) {
      onExistingChange(nextExisting);
      return;
    }

    // Parents that don't wire partial existing updates keep prior clear-all behavior.
    handleRemoveAll();
  };

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm leading-none font-medium">
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'border-border bg-muted/30 rounded-lg border border-dashed p-3 transition-colors',
          'hover:bg-muted/50 dark:bg-muted/10',
          error && 'border-destructive',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        {showing.length === 0 ? (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 py-6 text-center"
          >
            <div className="bg-background ring-border rounded-full p-2.5 shadow-sm ring-1">
              <UploadIcon className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">Choose file</span>
                {multiple ? 's' : ''} or drop here
              </p>
              {hint ? (
                <p className="text-muted-foreground text-xs">{hint}</p>
              ) : (
                <p className="text-muted-foreground text-xs">{accept}</p>
              )}
            </div>
          </label>
        ) : (
          <ul className="flex flex-col gap-2">
            {showing.map((file, index) => {
              const nameLabel = fileLabel(file);
              const size =
                file instanceof File
                  ? humanFileSize(file.size)
                  : file.size
                    ? humanFileSize(file.size)
                    : null;
              const href =
                !(file instanceof File) && file.url ? file.url : undefined;

              return (
                <li
                  key={`${nameLabel}-${index}`}
                  className="border-border bg-background flex items-center gap-3 rounded-md border px-3 py-2"
                >
                  <FileIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary block truncate text-sm font-medium hover:underline"
                      >
                        {nameLabel}
                      </a>
                    ) : (
                      <p className="truncate text-sm font-medium">
                        {nameLabel}
                      </p>
                    )}
                    {size ? (
                      <p className="text-muted-foreground text-xs">{size}</p>
                    ) : hasExisting ? (
                      <p className="text-muted-foreground text-xs">
                        Currently uploaded
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                    onClick={() => handleRemoveOne(index)}
                    aria-label={`Remove ${nameLabel}`}
                    disabled={disabled || isUploading}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                <UploadIcon className="mr-1.5 h-3.5 w-3.5" />
                {hasExisting ? 'Replace' : multiple ? 'Add files' : 'Replace'}
              </Button>
              {(hasSelection || hasExisting) && onRemove !== undefined ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleRemoveAll}
                  disabled={disabled || isUploading}
                >
                  <Trash2Icon className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              ) : null}
            </div>
          </ul>
        )}

        <input
          ref={inputRef}
          id={inputId}
          name={name ?? inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={handleChange}
        />
      </div>

      {showProgress ? (
        <div className="space-y-1">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>{isUploading ? 'Uploading…' : 'Upload complete'}</span>
            <span>{Math.round(displayPercentage)}%</span>
          </div>
          <Progress value={displayPercentage} />
        </div>
      ) : null}

      <InputError className="mt-1" message={displayError} />
    </div>
  );
}
