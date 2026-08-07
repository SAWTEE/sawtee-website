import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import FileUpload from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
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
import { toastFormErrors } from '@/lib/form-errors';

export default function EditPublicationForm({
  publication = undefined,
  categories = undefined,
  tags = undefined,
}: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    category_id: publication.category_id,
    title: publication.title,
    subtitle: publication.subtitle || '',
    volume: publication.volume || '',
    description: publication.description,
    image: publication.media[0] ? publication.media[0].original_url : null,
    file: null as File | string | null,
  });
  const { toast } = useToast();
  const [image, setImage] = useState(data.image);
  const [filename, setFilename] = useState(
    publication.file ? publication.file.name : null
  );
  const tagOptions = (tags ?? []).map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));
  const [publicationTags, setPublicationTags] = React.useState([]);

  function setDataTags(selectedValues: any) {
    const tagIds = selectedValues.map((item: any) => item.value);
    // @ts-ignore allowlist-migration
    setData('tags', tagIds);
  }

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
      setData('image', '');
    }
  }

  // @ts-ignore allowlist-migration
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
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 self-center px-4 md:col-span-8">
          <FormField
            id="title"
            label="Title/Issue"
            error={errors.title}
            required
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="text"
                name="title"
                autoFocus
                className="mt-1"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="subtitle"
            label="Subtitle"
            error={errors.subtitle}
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="text"
                name="subtitle"
                className="mt-1"
                autoComplete="subtitle"
                value={data.subtitle}
                onChange={e => setData('subtitle', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="volume"
            label="Volume"
            error={errors.volume}
            description="This feild is required for publications under the category of Trade Insight."
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="text"
                name="volume"
                className="mt-1"
                value={data.volume}
                onChange={e => setData('volume', e.target.value)}
              />
            )}
          </FormField>

          <Field
            data-invalid={errors.description || undefined}
            className="mx-2"
          >
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <ContentEditor
              name="description"
              initialValue={data.description || ''}
              id="description"
              onChange={(evt: any, editor: any) =>
                setData('description', editor.getContent())
              }
            />
            <FieldError>{errors.description}</FieldError>
          </Field>
        </div>
        <div className="col-span-12 flex flex-col gap-8 self-center px-3 md:col-span-4">
          <FormField
            id="category_id"
            label="Category"
            error={errors.category_id}
            className="mx-2"
          >
            {field => (
              <Select
                name="category_id"
                value={data.category_id}
                onValueChange={value => {
                  setData('category_id', Number(value));
                }}
              >
                <SelectTrigger
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
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
            )}
          </FormField>

          <Field id="tags" className="mx-2 gap-2">
            <FieldLabel htmlFor="tags">{' Add Tags'}</FieldLabel>
            {tagOptions && (
              <MultiSelect
                name={'tags'}
                options={tagOptions ?? null}
                defaultValue={publicationTags}
                placeholder="Select Tags"
                variant="inverted"
                maxCount={2}
                // @ts-ignore allowlist-migration
                onValueChange={setPublicationTags}
                setValues={setDataTags}
              />
            )}
          </Field>

          <Field
            data-invalid={errors.image || undefined}
            className="mx-2 gap-2"
          >
            <FieldLabel htmlFor="image">Featured Image</FieldLabel>
            <DropZone
              htmlFor={'image'}
              onValueChange={setDataImage}
              defaultValue={image}
              error={errors.image}
              progress={progress}
              uploading={processing}
            />
          </Field>

          <div className="mx-2">
            <FileUpload
              id="file"
              name="file"
              label="File Upload"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              value={data.file instanceof File ? data.file : null}
              existing={filename ? { name: filename } : null}
              progress={progress}
              error={errors.file}
              onChange={file => {
                const next = Array.isArray(file)
                  ? (file[0] ?? '')
                  : (file ?? '');
                setData('file', next);
                if (next instanceof File) {
                  setFilename(next.name);
                } else {
                  setFilename(null);
                }
              }}
              onRemove={() => {
                setData('file', '');
                setFilename(null);
              }}
              uploading={processing}
            />
          </div>

          <PrimaryButton type="submit" disabled={processing}>
            Save
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
