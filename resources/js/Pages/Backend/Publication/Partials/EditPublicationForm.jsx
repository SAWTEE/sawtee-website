import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { MultiSelect } from '@/components/ui/multi-select';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentEditor from '@/components/Backend/ContentEditor';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function EditPublicationForm({ publication, categories, tags }) {
  const { data, setData, post, processing, errors } = useForm({
    category_id: publication.category_id,
    title: publication.title,
    subtitle: publication.subtitle || '',
    volume: publication.volume || '',
    description: publication.description,
    image: publication.media[0] ? publication.media[0].original_url : null,
    file: publication.file ? publication.file.name : null,
  });
  const { toast } = useToast();
  const [image, setImage] = useState(data.image);
  const [tagOptions, setTagOptions] = useState([]);
  const [publicationTags, setPublicationTags] = React.useState([]);

  function setDataTags(selectedValues) {
    const tagIds = selectedValues.map(item => item.value);
    setData('tags', tagIds);
  }

  function setDataImage(image) {
    if (image) {
      const reader = new FileReader();
      reader.onload = e => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(image);
      setData('image', image);
    } else {
      setImage(null);
      setData('image', null);
    }
  }
  React.useEffect(() => {
    tags.length !== tagOptions.length &&
      setTagOptions(tags.map(tag => ({ value: tag.id, label: tag.name })));
  }, [tags]);

  // React.useEffect(() => {
  //   publication.tags.map(tag => {
  //     setPostTags(prev => [...prev, { value: tag.id, label: tag.name }]);
  //   });
  // }, [publication]);

  const submit = e => {
    e.preventDefault();
    post(
      route('admin.publications.update', {
        _method: 'patch',
        publication: publication.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Publication Edited.',
            description: `Publication ${data.title} Successfully`,
          }),
        onError: () => {
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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 self-center px-4 md:col-span-8">
          <div className="mx-2">
            <Label htmlFor="title">Title/Issue</Label>
            <Input
              type="text"
              required
              id="title"
              name="title"
              autoFocus
              className="mt-1"
              value={data.title}
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
              autoComplete="subtitle"
              value={data.subtitle}
              onChange={e => setData('subtitle', e.target.value)}
            />

            {errors.title && (
              <InputError className="mt-2">{errors.title}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Field>
              <FieldLabel htmlFor="volume">Volume</FieldLabel>
              <Input
                required
                type="text"
                id="volume"
                name="volume"
                className="mt-1"
                value={data.volume}
                onChange={e => setData('volume', e.target.value)}
              />
              <FieldDescription>
                This feild is required for publications under the category of
                Trade Insight.
              </FieldDescription>
            </Field>

            {errors.volume && (
              <InputError className="mt-2">{errors.volume}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Label htmlFor="description">Description</Label>

            <ContentEditor
              // type="classic"
              name="description"
              initialValue={data.description || ''}
              id="description"
              onChange={(evt, editor) =>
                setData('description', editor.getContent())
              }
            />

            {errors.description && (
              <InputError className="mt-2">{errors.description}</InputError>
            )}
          </div>
        </div>
        <div className="col-span-12 flex flex-col gap-8 self-center px-3 md:col-span-4">
          <fieldset className="mx-2">
            <Label as="legend" htmlFor="category_id">
              Category
            </Label>

            <Select
              name="category_id"
              value={data.category_id}
              onValueChange={value => {
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

                {categories.map(category => (
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
            {tagOptions && (
              <MultiSelect
                name={'tags'}
                options={tagOptions ?? null}
                defaultValue={publicationTags}
                placeholder="Select Tags"
                variant="inverted"
                maxCount={2}
                onValueChange={setPublicationTags}
                setValues={setDataTags}
              />
            )}
          </div>
          <div className="mx-2">
            <Label htmlFor="image">Featured Image</Label>
            <DropZone
              htmlFor={'image'}
              onValueChange={setDataImage}
              defaultValue={image}
            />

            {errors.image && (
              <InputError className="mt-2">{errors.image}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Label htmlFor="file">File Upload</Label>
            {data.file && (
              <Input
                type="text"
                id="file"
                name="file"
                className="mt-1"
                value={data.file.name || data.file}
                readOnly
              />
            )}
            {!data.file && (
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                id="file"
                className="mt-1"
                name="file"
                onChange={e => {
                  setData('file', e.target.files[0]);
                }}
              />
            )}
            {errors.file && (
              <InputError className="mt-2">{errors.file}</InputError>
            )}
          </div>

          <PrimaryButton type="submit" disabled={processing}>
            Save
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
