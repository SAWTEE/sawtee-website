import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { MultiSelect } from '@/components/ui/multi-select';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentEditor from '@/components/Backend/ContentEditor';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function CreatePublicationForm({
  categories = undefined,
  tags = undefined,
}: any) {
  const { data, setData, post, processing, errors, reset } = useForm({
    category_id: '',
    title: '',
    subtitle: '',
    volume: null,
    description: '',
    image: null,
    file: '',
    tags: [],
  });
  const [image, setImage] = useState(null);
  const tagOptions = (tags ?? []).map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));
  const [publicationTags, setPublicationTags] = React.useState([]);
  const { toast } = useToast();

  function setDataImage(image: any) {
    if (image) {
      const reader = new FileReader();
      reader.onload = e => {
        // @ts-ignore allowlist-migration
        setImage(e.target.result);
      };
      reader.readAsDataURL(image);
      setData('image', image);
    } else {
      setImage(null);
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.publications.store'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Publication Created.',
          description: `Publication ${data.title} Successfully`,
        }),
      onError: () => {
        for (const key in errors) {
          if (Object.hasOwnProperty.call(errors, key)) {
            // @ts-ignore allowlist-migration
            const value = errors[key];
            // @ts-ignore allowlist-migration
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

  function setDataTags(selectedValues: any) {
    const tagIds = selectedValues.map((item: any) => item.value);
    setData('tags', tagIds);
  }

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 px-4 md:col-span-8">
          <div className="mx-2">
            <Label htmlFor="title">Title/Issue</Label>
            <Input
              type="text"
              required
              id="title"
              name="title"
              className="mt-1"
              onChange={e => setData('title', e.target.value)}
            />

            {errors.title && (
              <InputError className="mt-2">{errors.title}</InputError>
            )}
          </div>
          <div className="mx-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              type="text"
              id="subtitle"
              name="subtitle"
              className="mt-1"
              onChange={e => setData('subtitle', e.target.value)}
            />

            {errors.title && (
              <InputError className="mt-2">{errors.title}</InputError>
            )}
          </div>

          {data.category_id ===
            // @ts-ignore allowlist-migration
            categories.find(category => category.slug === 'trade-insight')
              ?.id && (
            <div className="mx-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                type="text"
                id="volume"
                name="volume"
                className="mt-1"
                // @ts-ignore allowlist-migration
                onChange={e => setData('volume', e.target.value)}
              />

              {errors.volume && (
                <InputError className="mt-2">{errors.volume}</InputError>
              )}
            </div>
          )}
          <div className="mx-2">
            <Label htmlFor="description">Description</Label>

            <ContentEditor
              // type="classic"
              name="description"
              initialValue=""
              id="description"
              onChange={(evt: any, editor: any) =>
                setData('description', editor.getContent())
              }
            />

            {errors.description && (
              <InputError className="mt-2">{errors.description}</InputError>
            )}
          </div>
        </div>
        <div className="col-span-12 flex flex-col gap-8 px-3 md:col-span-4">
          <fieldset className="mx-2">
            <Label as="legend" htmlFor="category_id">
              Category
            </Label>

            <Select
              name="category_id"
              value={data.category_id}
              onValueChange={value => {
                // @ts-ignore allowlist-migration
                setData('category_id', Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                </SelectGroup>

                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category_id && (
              <InputError className={'mt-2'}>{errors.category_id}</InputError>
            )}
          </fieldset>

          <div id={'tags'} className="mx-2">
            <Label htmlFor="tags">{' Add Tags'}</Label>
            <MultiSelect
              name={'tags'}
              options={tagOptions}
              defaultValue={publicationTags}
              placeholder="Select Tags"
              variant="inverted"
              maxCount={2}
              // @ts-ignore allowlist-migration
              onValueChange={setPublicationTags}
              setValues={setDataTags}
            />
          </div>
          <div className="mx-2">
            <Label htmlFor="image">Featured Image</Label>
            <DropZone
              htmlFor={'image'}
              defaultValue={image}
              onValueChange={setDataImage}
            />

            {errors.image && (
              <InputError className="mt-2">{errors.image}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Label htmlFor="file">File Upload</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              id="file"
              className="mt-1"
              name="file"
              onChange={e => {
                // @ts-ignore allowlist-migration
                setData('file', e.target.files[0]);
              }}
            />

            {errors.file && (
              <InputError className="mt-2">{errors.file}</InputError>
            )}
          </div>

          <PrimaryButton type="submit" disabled={processing}>
            Add
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
