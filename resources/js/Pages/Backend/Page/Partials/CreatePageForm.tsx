import { useForm } from '@inertiajs/react';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import FileUpload from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';
import { slugify } from '@/lib/helpers';
import { pageTemplates } from '@/lib/pageTemplates';

export default function CreatePageForm() {
  const { data, setData, post, processing, errors, reset, progress } = useForm({
    name: '',
    slug: null,
    content: '',
    image: '',
    meta_title: '',
    meta_description: '',
    page_template: 'DefaultPage',
    file: null as any,
  });
  const { toast } = useToast();
  const [slug, setSlug] = React.useState('');
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (['About', 'Contact', 'MediaFellows'].includes(data.page_template)) {
      toast({
        title: 'Please add json page data',
        description:
          "These pages depend upon the json data provided to the template. Please add json data to the template. May throw error if you don't.",
      });
    }
  }, [data.page_template, toast]);

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.pages.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Page Created.',
          description: 'Page Created Successfully',
        });
        reset();
        setImage(null);
        setSlug('');
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

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
      // @ts-ignore allowlist-migration
      setData('image', null);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="name"
          label="Name"
          error={errors.name}
          className="col-span-2"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="name"
              placeholder="enter page name"
              onChange={e => {
                setData('name', e.target.value);
                setSlug(slugify(e.target.value));
              }}
            />
          )}
        </FormField>

        <FormField
          id="slug"
          label="Slug"
          error={errors.slug}
          className="col-span-2"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="slug"
              value={slug ? slug : ''}
              // @ts-ignore allowlist-migration
              onChange={e => setData('slug', e.target.value)}
              // @ts-ignore allowlist-migration
              display="flex"
              mt={1}
            />
          )}
        </FormField>

        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <FileUpload
              id="file"
              name="file"
              label="File Upload"
              accept=".json"
              value={data.file instanceof File ? data.file : null}
              progress={progress}
              error={errors.file}
              onChange={file => setData('file', file ?? null)}
              onRemove={() => setData('file', null)}
              uploading={processing}
            />
          </div>

          <FormField
            id="meta_title"
            label="Meta Title"
            error={errors.meta_title}
          >
            {field => (
              <Input
                {...field}
                name="meta_title"
                placeholder="enter meta title"
                onChange={e => setData('meta_title', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="meta_description"
            label="Meta Description"
            error={errors.meta_description}
          >
            {field => (
              <Textarea
                {...field}
                name="meta_description"
                placeholder="enter meta description"
                rows={5}
                onChange={e => setData('meta_description', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="page_template"
            label="Page Template"
            error={errors.page_template}
          >
            {field => (
              <Select
                // @ts-ignore allowlist-migration
                placeholder="Select menu to edit"
                value={data.page_template}
                name="page_template"
                onValueChange={value => setData('page_template', value)}
              >
                <SelectTrigger
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
                  <SelectValue placeholder="Select page template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Page Templates</SelectLabel>
                    {pageTemplates?.map((template: any) => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>

        <Field
          data-invalid={errors.image || undefined}
          className="col-span-1 gap-2"
        >
          <DropZone
            htmlFor="image"
            onValueChange={setDataImage}
            defaultValue={image}
            error={errors.image}
            progress={progress}
            uploading={processing}
          />
        </Field>

        <Field
          data-invalid={errors.content || undefined}
          className="col-span-2"
        >
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <ContentEditor
            name="content"
            id="content"
            onChange={(evt: any, editor: any) => {
              setData('content', editor.getContent());
            }}
          />
          <FieldError>{errors.content}</FieldError>
        </Field>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
