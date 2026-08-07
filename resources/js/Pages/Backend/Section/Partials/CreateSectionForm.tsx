import { useForm } from '@inertiajs/react';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
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
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateSectionForm({
  sections = undefined,
  pages = undefined,
}: any) {
  const { data, setData, post, processing, errors, reset, progress } = useForm({
    title: '',
    description: '',
    type: 'default',
    link: '',
    parent_id: null,
    page_id: null,
    order: null,
    image: '',
  });
  const { toast } = useToast();

  const sectionTypes = ['default', 'tabs', 'accordian', 'members'];
  const [image, setImage] = React.useState(null);

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

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.sections.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast({
          title: 'Section Created.',
          description: `Section ${data.title} created Successfully`,
        });
        reset();
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid-rows-[minmax(auto, 1fr)] grid gap-4 lg:grid-cols-[repeat(4,minmax(100px,1fr))]">
        <FormField
          id="title"
          label="Section Title"
          error={errors.title}
          className="col-span-4"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="title"
              autoComplete="title"
              className="mt-1"
              onChange={e => setData('title', e.target.value)}
            />
          )}
        </FormField>

        <Field
          data-invalid={errors.image || undefined}
          className="col-span-2 gap-2"
        >
          <FieldLabel htmlFor="image">Image</FieldLabel>
          <DropZone
            htmlFor={'image'}
            onValueChange={setDataImage}
            defaultValue={image}
            error={errors.image}
            progress={progress}
            uploading={processing}
          />
        </Field>
        <div className="col-span-2 grid w-full grid-cols-subgrid gap-4">
          <FormField
            id="page_id"
            label="For Page"
            error={errors.page_id}
            className="col-span-1"
          >
            {field => (
              <Select
                name="page_id"
                onValueChange={value => {
                  // @ts-ignore allowlist-migration
                  setData('page_id', value);
                }}
              >
                <SelectTrigger
                  id={field.id}
                  className="mt-1"
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
                  <SelectValue placeholder="Select Page" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  <SelectGroup>
                    <SelectLabel>Pages</SelectLabel>
                    {pages &&
                      pages.length > 0 &&
                      pages.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            id="order"
            label="Order"
            error={errors.order}
            className="col-span-1"
          >
            {field => (
              <Input
                {...field}
                type="number"
                name="order"
                className="mt-1"
                defaultValue={0}
                onChange={e => {
                  // @ts-ignore allowlist-migration
                  setData('order', Number(e.target.value));
                }}
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
                type="text"
                name="link"
                className="mt-1"
                autoComplete="link"
                onChange={e => setData('link', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="type"
            label="Section Type"
            error={errors.type}
            className="col-span-1"
          >
            {field => (
              <Select
                name="type"
                onValueChange={value => setData('type', value)}
              >
                <SelectTrigger
                  id={field.id}
                  className="mt-1"
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
                  <SelectValue placeholder="Select Section Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Section Types</SelectLabel>
                    {sectionTypes.map((item: any) => (
                      <SelectItem key={item} value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField
            id="parent_id"
            label="Parent Section"
            error={errors.parent_id}
            className="col-span-1"
          >
            {field => (
              <Select
                name="parent_id"
                disabled={data.type === 'default'}
                onValueChange={value => {
                  // @ts-ignore allowlist-migration
                  setData('parent_id', value);
                }}
              >
                <SelectTrigger
                  id={field.id}
                  className="mt-1"
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
                  <SelectValue placeholder="Select Parent" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  <SelectGroup>
                    <SelectLabel>Sections</SelectLabel>
                    {sections?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </FormField>
        </div>

        <Field
          data-invalid={errors.description || undefined}
          className="col-span-4 gap-2"
        >
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <ContentEditor
            name="description"
            id="description"
            className="mt-1"
            initialValue=""
            onChange={(evt: any, editor: any) =>
              setData('description', editor.getContent())
            }
          />
          <FieldError>{errors.description}</FieldError>
        </Field>
        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
