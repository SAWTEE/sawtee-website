import { useForm } from '@inertiajs/react';

import FileUpload from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreatePublishedStory({ fellows = undefined }: any) {
  const { data, setData, post, errors, reset, progress, processing } = useForm({
    title: '',
    fellow_id: undefined,
    link: '',
    images: [] as any,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.published-stories.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Story Created.',
          description: 'Story Created Successfully',
        });
        reset();
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-4 items-center gap-4">
        <FormField
          id="title"
          label="Name"
          error={errors.title}
          required
          className="col-span-4"
        >
          {field => (
            <Input
              {...field}
              name="title"
              className="col-span-3"
              placeholder="enter story title"
              onChange={e => setData('title', e.target.value)}
            />
          )}
        </FormField>
        <FormField
          id="link"
          label="Link"
          error={errors.link}
          className="col-span-2"
        >
          {field => (
            <Input
              {...field}
              name="link"
              placeholder="enter fellow link"
              onChange={e => setData('link', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="fellow_id"
          label="Select Fellow"
          error={errors.fellow_id}
          className="col-span-2"
        >
          {field => (
            <Select
              name="fellow_id"
              value={data.fellow_id ?? ''}
              // @ts-ignore allowlist-migration
              onValueChange={value => setData('fellow_id', Number(value))}
            >
              <SelectTrigger
                id={field.id}
                aria-invalid={field['aria-invalid']}
                aria-describedby={field['aria-describedby']}
              >
                <SelectValue placeholder="Select fellow" />
              </SelectTrigger>
              <SelectContent>
                {fellows.map((fellow: any) => (
                  <SelectItem key={fellow.id} value={fellow.id}>
                    {fellow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <div className="col-span-2">
          <FileUpload
            id="images"
            name="images"
            label="Images"
            multiple
            accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
            value={
              Array.isArray(data.images) && data.images[0] instanceof File
                ? data.images
                : null
            }
            progress={progress}
            error={errors.images}
            onChange={files => setData('images', files ?? [])}
            onRemove={() => setData('images', [])}
            uploading={processing}
          />
        </div>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
