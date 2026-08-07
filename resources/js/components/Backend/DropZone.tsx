import { ImageIcon, Trash2Icon, UploadIcon, XIcon } from 'lucide-react';
import {
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  useId,
  useRef,
  useState,
} from 'react';

import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';

type UploadProgress = {
  percentage?: number | null;
} | null | undefined;

type DropZoneProps = {
  id?: string;
  htmlFor?: string;
  name?: string;
  accept?: string;
  placeholder?: string;
  /** Preview URL (object URL, data URL, or remote media URL). */
  defaultValue?: string | null;
  disabled?: boolean;
  className?: string;
  error?: string;
  /** Reject files larger than this many megabytes before calling onValueChange. */
  maxSizeMB?: number;
  /** Inertia `progress` from useForm while submitting. */
  progress?: UploadProgress;
  /**
   * True while the parent form request is in flight. Shows the bar before the
   * first XHR progress event (common on fast local uploads).
   */
  uploading?: boolean;
  onValueChange?: (file: File | null) => void;
  /** Optional extra clear hook (e.g. mark existing media for removal). */
  onRemove?: () => void;
};

function acceptHint(accept: string): string {
  return accept
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => (part.startsWith('.') ? part : part.replace(/^image\//, '.')))
    .join(', ');
}

export default function DropZone({
  id,
  htmlFor,
  name,
  accept = DEFAULT_ACCEPT,
  placeholder = 'PNG, JPG or WebP',
  defaultValue = null,
  disabled = false,
  className,
  error,
  maxSizeMB = 2,
  progress = null,
  uploading = false,
  onValueChange,
  onRemove,
}: DropZoneProps) {
  const generatedId = useId();
  const inputId = id ?? htmlFor ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const percentage = progress?.percentage ?? null;
  const hasPendingUpload = selectedFile != null;
  const showProgress =
    percentage != null || (uploading && hasPendingUpload);
  const displayPercentage = percentage ?? 0;
  const isUploading =
    (uploading && hasPendingUpload) ||
    (percentage != null && percentage < 100);
  const hasPreview = Boolean(defaultValue);
  const displayError = error || localError || undefined;

  const emit = (file: File | null) => {
    if (file && maxSizeMB > 0 && file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Image must be ${maxSizeMB}MB or smaller.`);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    setLocalError(null);
    setSelectedFile(file);
    onValueChange?.(file);
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (event?: MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    clearInput();
    setLocalError(null);
    setSelectedFile(null);
    onValueChange?.(null);
    onRemove?.();
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) {
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) {
      emit(file);
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    emit(file);
    // Allow re-selecting the same file after remove.
    event.target.value = '';
  };

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <div
        className={cn(
          'rounded-xl border-2 border-dashed transition-colors',
          'border-border bg-muted/40 hover:bg-muted/70',
          'dark:border-border dark:bg-muted/20 dark:hover:bg-muted/40',
          isDragging && 'border-primary bg-primary/5',
          displayError && 'border-destructive',
          disabled && 'pointer-events-none opacity-60',
          hasPreview && 'border-solid'
        )}
      >
        {!hasPreview ? (
          <label
            htmlFor={inputId}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden',
              isUploading && 'pointer-events-none'
            )}
          >
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <div className="rounded-full bg-background p-2.5 shadow-sm ring-1 ring-border">
                <UploadIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">{placeholder}</p>
                <p className="text-xs text-muted-foreground/80">
                  {acceptHint(accept)} · max {maxSizeMB}MB
                </p>
              </div>
            </div>
          </label>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-[10px]">
            <label
              htmlFor={inputId}
              className={cn(
                'group relative block h-full w-full cursor-pointer',
                isUploading && 'pointer-events-none'
              )}
            >
              <img
                src={defaultValue ?? undefined}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Replace image
                </span>
              </div>
            </label>

            {/* <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full opacity-90 shadow-sm"
              onClick={handleRemove}
              aria-label="Remove image"
              disabled={disabled || isUploading}
            >
              <XIcon className="h-4 w-4" />
            </Button> */}

            <div className="absolute bottom-2 left-2 z-10 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 bg-background/90 shadow-sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                <UploadIcon className="mr-1.5 h-3.5 w-3.5" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 bg-background/80 text-destructive hover:text-destructive"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <Trash2Icon className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          id={inputId}
          name={name ?? htmlFor ?? inputId}
          type="file"
          accept={accept}
          disabled={disabled || isUploading}
          className="sr-only"
          onChange={handleFileSelect}
        />
      </div>

      {showProgress ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
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
