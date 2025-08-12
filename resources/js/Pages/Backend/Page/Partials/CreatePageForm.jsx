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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { slugify } from '@/lib/helpers';
import { pageTemplates } from '@/lib/pageTemplates';
import { useForm } from '@inertiajs/react';
import React from 'react';

export default function CreatePageForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    slug: null,
    content: '',
    image: '',
    meta_title: '',
    meta_description: '',
    page_template: 'DefaultPage',
    file: null,
  });
  const { toast } = useToast();
  const [slug, setSlug] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [filename, setFilename] = React.useState(null);

  React.useEffect(() => {
    if (data.page_template === ('About' || 'Contact' || 'MediaFellows')) {
      toast({
        title: 'Please add json page data',
        description:
          "These pages depend upon the json data provided to the template. Please add json data to the template. May throw error if you don't.",
      });
    }
  }, [data.page_template]);

  const submit = e => {
    e.preventDefault();
    post(route('admin.pages.store'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Page Created.',
          description: 'Page Created Successfully',
        }),
      onError: errors => {
        if (errors.name) {
          reset('name');
        }
      },
    });
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
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="enter page name"
            onChange={e => {
              setData('name', e.target.value);
              setSlug(slugify(e.target.value));
            }}
          />

          {errors.name && (
            <InputError className="mt-2">{errors.name}</InputError>
          )}
        </div>
        <div className="col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            type="text"
            id="slug"
            name="slug"
            value={slug ? slug : ''}
            onChange={e => setData('slug', e.target.value)}
            display="flex"
            mt={1}
          />
          {errors.slug && (
            <InputError className="mt-2">{errors.slug}</InputError>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <Label htmlFor="file">File Upload</Label>
            <Input
              type="file"
              accept=".json"
              id="file"
              name="file"
              onChange={e => {
                setFilename(e.target.files[0].name);
                setData('file', e.target.files[0]);
              }}
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="meta_title">Meta Title</Label>

            <Input
              id="meta_title"
              name="meta_title"
              placeholder="enter meta title"
              onChange={e => setData('meta_title', e.target.value)}
            />

            {errors.meta_title && (
              <InputError className="mt-2">{errors.meta_title}</InputError>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="meta_description">Meta Description</Label>

            <Textarea
              id="meta_description"
              name="meta_description"
              placeholder="enter meta description"
              rows={5}
              onChange={e => setData('meta_description', e.target.value)}
            />

            {errors.meta_description && (
              <InputError className="mt-2">
                {errors.meta_description}
              </InputError>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="page_template">Page Template</Label>
            <Select
              placeholder="Select menu to edit"
              value={data.page_template}
              name="page_template"
              id="page_template"
              onValueChange={value => setData('page_template', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select page template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Page Templates</SelectLabel>
                  {pageTemplates?.map(template => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-1">
          <DropZone
            htmlFor="image"
            onValueChange={setDataImage}
            defaultValue={image}
          />
          {errors.image && (
            <InputError className="mt-2">{errors.image}</InputError>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="content">Content</Label>
          <ContentEditor
            name="content"
            id="content"
            onChange={(evt, editor) => {
              setData('content', editor.getContent());
            }}
          />

          {errors.content && (
            <InputErrorMessage className="mt-2">
              {errors.content}
            </InputErrorMessage>
          )}
        </div>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
