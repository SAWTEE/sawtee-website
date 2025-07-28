import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import React from 'react';

export default function EditSectionForm({ sections, section, pages }) {
  const { data, setData, post, processing, errors } = useForm({
    title: section.title,
    description: section.description,
    type: section.type,
    link: section.link ?? '',
    parent_id: section.parent_id ?? '',
    order: section.order ?? 0,
    page_id: section.page_id,
  });

  const { toast } = useToast();
  const sectionTypes = ['default', 'tabs', 'accordian', 'members'];

  const [image, setImage] = React.useState(
    section.media.length > 0 ? section.media[0].preview_url : ''
  );

  const submit = e => {
    e.preventDefault();
    post(
      route('admin.sections.update', {
        _method: 'patch',
        section: section.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Section edited.',
            description: 'Section edited Successfully',
          }),
        onError: errors => {
          for (const key in errors) {
            if (Object.hasOwnProperty.call(errors, key)) {
              const value = errors[key];
              reset([key], { keepErrors: true });
              return toast({
                title: `${key.toUpperCase()} field error`,
                description: value,
              });
            }
          }
        },
      }
    );
  };

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

  return (
    <form onSubmit={submit}>
      <div className="grid-rows-[minmax(auto, 1fr)] grid gap-4 lg:grid-cols-[repeat(4,minmax(100px,1fr))]">
        <div className="col-span-4">
          <Label htmlFor="title">Section Title</Label>

          <Input
            type="text"
            id="title"
            name="title"
            autoComplete="title"
            className="mt-1"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
          />

          {errors.title && <InputError mt={2}>{errors.title}</InputError>}
        </div>

        <div className="col-span-2">
          <DropZone
            htmlFor={'image'}
            onValueChange={setDataImage}
            defaultValue={image}
          />
        </div>
        <div className="col-span-2 grid w-full grid-cols-subgrid gap-4">
          <div className="col-span-1">
            <Label as="legend" htmlFor="page_id">
              For Page
            </Label>

            <Select
              name="page_id"
              id="page_id"
              value={data.page_id.toString()}
              onValueChange={value => {
                setData('page_id', value);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent className="w-[300px]">
                <SelectGroup>
                  <SelectLabel>Pages</SelectLabel>
                  {pages &&
                    pages.length > 0 &&
                    pages.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <Label htmlFor="order">Order</Label>
            <Input
              type="number"
              id="order"
              name="order"
              className="mt-1"
              value={data.order}
              onChange={e => setData('order', e.target.value)}
            />
            {errors.order && <InputError mt={2}>{errors.order}</InputError>}
          </div>

          <div className="col-span-2">
            <Label htmlFor="link">Link</Label>

            <Input
              type="text"
              id="link"
              name="link"
              className="mt-1"
              autoComplete="link"
              value={data.link}
              onChange={e => setData('link', e.target.value)}
            />

            {errors.link && (
              <InputError className="mt-2">{errors.link}</InputError>
            )}
          </div>

          <div className="col-span-1">
            <fieldset>
              <Label htmlFor="type">Section Type</Label>

              <Select
                name="type"
                id="type"
                value={data.type}
                onValueChange={value => setData('type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Section Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Section Types</SelectLabel>
                    {sectionTypes.map(item => (
                      <SelectItem key={item} value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.type && <InputError mt={2}>{errors.type}</InputError>}
            </fieldset>
          </div>
          <div className="col-span-1">
            <fieldset>
              <Label as="legend" htmlFor="parent_id">
                Parent Section
              </Label>

              <Select
                name="parent_id"
                id="parent_id"
                disabled={data.type === 'default'}
                value={data.parent_id}
                onValueChange={value => {
                  setData('parent_id', value);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Parent" />
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  <SelectGroup>
                    <SelectLabel>Sections</SelectLabel>
                    {sections?.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </fieldset>
          </div>
        </div>

        <div className="col-span-4">
          <Label htmlFor="description">Description</Label>
          <ContentEditor
            name="description"
            id="description"
            className="mt-1"
            initialValue={data.description}
            onChange={(evt, editor) =>
              setData('description', editor.getContent())
            }
          />

          {errors.description && (
            <InputError mt={2}>{errors.description}</InputError>
          )}
        </div>
        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
