import { useForm } from '@inertiajs/react';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import FileUpload from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export default function EditPageForm({ page = undefined }: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    name: page.name,
    slug: page.slug,
    content: page.content,
    image: null,
    meta_title: page.meta_title,
    meta_description: page.meta_description,
    page_template: page.page_template,
    file: null as any,
  });
  const [showData, setShowData] = React.useState(false);

  const { toast } = useToast();
  const [slug, setSlug] = React.useState(page.slug);
  const [image, setImage] = React.useState(
    page.media[0] ? page.media[0].original_url : null
  );
  const [existingPageData, setExistingPageData] = React.useState(
    page.pageData
      ? { name: 'Current page data (JSON)' }
      : page.file
        ? {
            name:
              typeof page.file === 'string'
                ? page.file
                : (page.file.name ?? 'page-data.json'),
          }
        : null
  );

  React.useEffect(() => {
    if (['About', 'Contact', 'MediaFellows'].includes(data.page_template)) {
      toast({
        title: 'Please add page data file',
        variant: 'destructive',
        description:
          "This template depend upon the json data provided to the template. Please add json data to the template. May throw error if you don't.",
      });
    }
  }, [data.page_template, toast]);

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.pages.update', {
        _method: 'patch',
        page: page.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Page Edited.',
            description: 'Page Edited Successfully',
          }),
        onError: errors => toastFormErrors(errors, toast),
      }
    );
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
              value={data.name}
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
              value={slug}
              // @ts-ignore allowlist-migration
              display="flex"
              onChange={e => setSlug(e.target.value)}
              mt={1}
            />
          )}
        </FormField>

        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <FieldLabel htmlFor="file">Add JSON Data File</FieldLabel>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => setShowData(!showData)}
              >
                View Page Data
              </Button>
            </div>
            <FileUpload
              id="file"
              name="file"
              accept=".json"
              value={data.file instanceof File ? data.file : null}
              existing={existingPageData}
              progress={progress}
              error={errors.file}
              onChange={file => {
                const next = Array.isArray(file)
                  ? (file[0] ?? '')
                  : (file ?? '');
                setData('file', next);
              }}
              onRemove={() => {
                setData('file', '');
                setExistingPageData(null);
              }}
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
                value={data.meta_title}
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
                value={data.meta_description ?? ''}
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
            initialValue={data.content}
            onChange={(evt: any, editor: any) => {
              setData('content', editor.getContent());
            }}
          />
          <FieldError>{errors.content}</FieldError>
        </Field>

        <ShowPageData
          open={showData}
          onOpenChange={setShowData}
          data={page.pageData}
        />

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}

const ShowPageData = ({
  open = undefined,
  onOpenChange = undefined,
  data = undefined,
}: any) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Page Data from the JSON file</AlertDialogTitle>
          <ScrollArea className="max-h-125 overflow-auto">
            <AlertDialogContent>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </AlertDialogContent>
          </ScrollArea>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
