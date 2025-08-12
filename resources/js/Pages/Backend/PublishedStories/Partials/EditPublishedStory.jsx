import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditPublishedStory({ fellows, publishedStory }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: publishedStory.title,
    fellow_id: publishedStory.fellow_id,
    link: publishedStory.link,
    images: publishedStory.media?.filter(
      m => m.collection_name === 'published-story-images'
    ),
  });
  const { toast } = useToast();

  const submit = e => {
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
          reset();
        },
        onError: errors => {
          for (const key in errors) {
            if (Object.hasOwnProperty.call(errors, key)) {
              const value = errors[key];
              reset(key);
              return toast({
                title: 'Uh oh, Something went wrong',
                description: `${key.toUpperCase()} field error` + `: ${value}`,
              });
            }
          }
        },
      }
    );
  };

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
          <Label htmlFor="title">Name</Label>
          <Input
            id="title"
            name="title"
            className="col-span-3"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            required
          />

          {errors.title && (
            <InputError className="mt-2">{errors.title}</InputError>
          )}
        </div>
        <div className="col-span-2">
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            name="link"
            value={data.link}
            onChange={e => setData('link', e.target.value)}
          />

          <InputError className="mt-2">{errors.link}</InputError>
        </div>

        <div className="col-span-2">
          <Label htmlFor="fellow_id">Select Fellow</Label>
          <Select
            name="fellow_id"
            id="fellow_id"
            value={data.fellow_id ?? ''}
            onValueChange={value => setData('fellow_id', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fellow" />
            </SelectTrigger>
            <SelectContent>
              {fellows.map(fellow => (
                <SelectItem key={fellow.id} value={fellow.id}>
                  {fellow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="images">Image</Label>

          {/* <DropZone
            htmlFor={'image'}
            onValueChange={setDataImage}
            defaultValue={image}
            //   className="h-64"
          /> */}

          <Input
            type="file"
            multiple
            className="mt-1"
            accept="image/*"
            id="images"
            name="images"
            onChange={e => {
              setData('images', Array.from(e.target.files));
            }}
          />

          {errors.image && (
            <InputError className="mt-2">{errors.image}</InputError>
          )}
        </div>

        {data.images.length > 0 && (
          <div className="col-span-2">
            <p>Previous Images</p>
            <div className="flex flex-wrap gap-2 mt-1">
            {data.images.map(image => {
              return (
                  <div className="aspect-square w-[6rem]">
                    <img src={image.original_url} alt={image.file_name} />
                  </div>
              );
            })}
            </div>
          </div>
        )}
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
