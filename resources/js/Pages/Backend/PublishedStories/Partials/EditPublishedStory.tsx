import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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

export default function EditPublishedStory({ fellows, publishedStory }: any) {
  const existingMedia =
    publishedStory.media?.filter(
      (m: any) => m.collection_name === 'published-story-images'
    ) ?? [];

  const { data, setData, post, errors, progress, processing } = useForm({
    title: publishedStory.title,
    fellow_id: publishedStory.fellow_id,
    link: publishedStory.link,
    images: [] as any,
  });
  const { toast } = useToast();
  const [existingImages, setExistingImages] = useState(
    existingMedia.map((image: any) => ({
      name: image.file_name ?? image.name ?? 'Image',
      url: image.original_url ?? image.url ?? null,
    }))
  );

  const submit = (e: any) => {
    e.preventDefault();

    post(
      route('admin.published-stories.update', {
        _method: 'patch',
        published_story: publishedStory,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Story Edited.',
            description: 'Story Edited Successfully',
          });
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
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
              value={data.title}
              onChange={(e: any) => setData('title', e.target.value)}
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
              value={data.link}
              onChange={(e: any) => setData('link', e.target.value)}
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
              value={String(data.fellow_id ?? '')}
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
                  <SelectItem key={fellow.id} value={String(fellow.id)}>
                    {fellow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <div className="col-span-4">
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
            existing={existingImages}
            progress={progress}
            error={(errors as any).images ?? (errors as any).image}
            onChange={files => setData('images', files ?? [])}
            onRemove={() => {
              setData('images', '');
              setExistingImages([]);
            }}
            uploading={processing}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
