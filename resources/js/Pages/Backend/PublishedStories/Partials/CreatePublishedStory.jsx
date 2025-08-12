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

export default function CreatePublishedStory({ fellows }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    fellow_id: undefined,
    link: '',
    images: [],
  });
  const { toast } = useToast();

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
    });
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
            placeholder="enter story title"
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
            placeholder="enter fellow link"
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

          {errors.images && (
            <InputError className="mt-2">{errors.images}</InputError>
          )}
        </div>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
