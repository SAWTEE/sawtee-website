import { useForm } from '@inertiajs/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import DropZone from '@/components/Backend/DropZone';
import FileUpload from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditResearchForm({ research = undefined }: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: research.title ?? '',
    subtitle: research.subtitle ?? '',
    description: research.description ?? '',
    year: research.year ?? '',
    file: null as File | string | null,
    link: research.link ?? '',
    image: research.media[0] ? research.media[0].original_url : undefined,
    meta_title: research.meta_title ?? '',
    meta_description: research.meta_description ?? '',
  });
  const { toast } = useToast();
  const [image, setImage] = useState(data.image);

  const [filename, setFilename] = useState(
    research.file ? research.file.name : null
  );

  function setDataImage(imageFile: any) {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = e => {
        // @ts-ignore allowlist-migration
        setImage(e.target.result);
      };
      reader.readAsDataURL(imageFile);
      setData('image', imageFile);
    } else {
      setImage(null);
      // @ts-ignore allowlist-migration
      setData('image', '');
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.research.update', {
        _method: 'patch',
        research: research.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Research Edited.',
            description: `Research edited Successfully`,
          }),
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 px-4 md:col-span-8">
          <FormField
            id="title"
            label="Title"
            error={errors.title}
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="text"
                name="title"
                placeholder="enter research title"
                className="mt-1"
                value={data.title}
                autoComplete="title"
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
                value={data.subtitle}
                placeholder="enter research subtitle"
                autoComplete="subtitle"
                onChange={e => setData('subtitle', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="description"
            label="Description"
            error={errors.description}
            className="mx-2"
          >
            {field => (
              <Textarea
                {...field}
                name="description"
                rows={6}
                className="mt-1"
                value={data.description}
                // @ts-ignore allowlist-migration
                resize={'vertical'}
                placeholder="Describe your research here."
                onChange={e => setData('description', e.target.value)}
              />
            )}
          </FormField>
        </div>
        <div className="col-span-12 flex flex-col gap-8 self-center px-3 md:col-span-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex gap-2">
                  SEO Meta Tags
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add meta-title and meta-description for SEO</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col justify-start gap-4">
                  <FormField
                    id="meta_title"
                    label="Meta Title"
                    error={errors.meta_title}
                    className="mx-2"
                  >
                    {field => (
                      <Input
                        {...field}
                        name="meta_title"
                        className="mt-1"
                        value={data.meta_title}
                        placeholder="enter meta title"
                        onChange={e => setData('meta_title', e.target.value)}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="meta_description"
                    label="Meta Description"
                    error={errors.meta_description}
                    className="mx-2"
                  >
                    {field => (
                      <Textarea
                        {...field}
                        name="meta_description"
                        value={data.meta_description}
                        className="mt-1 block"
                        placeholder="enter meta_description"
                        rows={3}
                        onChange={e =>
                          setData('meta_description', e.target.value)
                        }
                      />
                    )}
                  </FormField>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <FormField
            id="year"
            label="Year"
            error={errors.year}
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                name="year"
                className="mt-1"
                value={data.year}
                onChange={e => setData('year', Number(e.target.value))}
              />
            )}
          </FormField>

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

          <FormField
            id="link"
            label="External Link"
            error={errors.link}
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="text"
                name="link"
                className="mt-1"
                value={data.link}
                autoComplete="link"
                onChange={e => setData('link', e.target.value)}
              />
            )}
          </FormField>

          <Field
            data-invalid={errors.image || undefined}
            className="mx-2 gap-2"
          >
            <FieldLabel htmlFor="image">Featured Image</FieldLabel>
            <DropZone
              htmlFor="image"
              defaultValue={image}
              onValueChange={setDataImage}
              error={errors.image}
              progress={progress}
              uploading={processing}
            />
          </Field>

          <PrimaryButton type="submit" disabled={processing}>
            Save
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
