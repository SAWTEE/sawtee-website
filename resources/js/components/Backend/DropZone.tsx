import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function DropZone({
  htmlFor,
  accept = 'image/.png,.jpg,.jpeg,.webp',
  placeholder = 'Drag and drop image here, or click to select an image',
  defaultValue = null,
  onValueChange,
  ...props
}) {
  const handleDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
  };
  const handleDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    onValueChange(Array.from(event.dataTransfer.files)[0]);
  };
  const handleFileSelect = event => {
    event.stopPropagation();
    onValueChange(Array.from(event.target.files)[0]);
  };
  const handleRemoveFile = () => {
    onValueChange(null);
  };

  return (
    <div className={cn('relative', props.className)}>
      <Label
        htmlFor={htmlFor}
        className="flex aspect-video h-auto w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-700 bg-gray-50 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
      >
        {!defaultValue && (
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{accept}</p>
            <Input
              id={htmlFor}
              name={htmlFor}
              type="file"
              placeholder={placeholder}
              accept={accept}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileSelect}
            />
          </div>
        )}
        {defaultValue && (
          <div className="h-64 w-full">
            <img
              src={defaultValue}
              alt="section hero"
              className="h-full w-full rounded-md object-cover"
            />
            <Button
              className="absolute right-2 top-2 rounded-full opacity-60 hover:opacity-100"
              onClick={handleRemoveFile}
              variant="destructive"
              size="icon"
            >
              <XIcon className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </Label>
    </div>
  );
}
