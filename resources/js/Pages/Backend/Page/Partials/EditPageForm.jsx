import ContentEditor from '@/components/Backend/ContentEditor';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import pageTemplates from '../pageTemplates';

import { Button } from '@/components/ui/button';
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
import { useToast } from '@/components/ui/use-toast';
import { slugify } from '@/lib/helpers';
import { useForm } from '@inertiajs/react';
import { XCircleIcon } from 'lucide-react';
import React from 'react';
export default function EditPageForm({ page }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: page.name,
    slug: page.slug,
    content: page.content,
    image: null,
    meta_title: page.meta_title,
    meta_description: page.meta_description,
    page_template: page.page_template,
    file: null,
  });
  const [showData, setShowData] = React.useState(false);

  const { toast } = useToast();
  const [slug, setSlug] = React.useState(page.slug);
  const [image, setImage] = React.useState(
    page.media[0] ? page.media[0].original_url : null
  );
  const [filename, setFilename] = React.useState(null);

  React.useEffect(() => {
    if (data.page_template === ('About' || 'Contact' || 'MediaFellows')) {
      toast({
        title: 'Please add page data file',
        variant: 'destructive',
        description:
          "This template depend upon the json data provided to the template. Please add json data to the template. May throw error if you don't.",
      });
    }
  }, [data.page_template]);

  const submit = e => {
    e.preventDefault();
    console.log(data);
    post(
      route('admin.pages.update', {
        _method: 'patch',
        page: page.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            position: 'top-right',
            title: 'Page Edited.',
            description: 'Page Edited Successfully',
            status: 'success',
            duration: 6000,
            isClosable: true,
          }),
        onError: errors => {
          if (errors.name) {
            reset('name');
          }
        },
      }
    );
  };

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="col-span-1">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="enter page name"
              value={data.name}
              onChange={e => {
                setData('name', e.target.value);
                setSlug(slugify(e.target.value));
              }}
            />

            {errors.name && (
              <InputError className="mt-2">{errors.name}</InputError>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              id="slug"
              name="slug"
              value={slug}
              display="flex"
              onChange={e => setSlug(e.target.value)}
              mt={1}
            />
            {errors.slug && (
              <InputError className="mt-2">{errors.slug}</InputError>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="file">Add JSON Data File</Label>

            <Button
              type="button"
              variant="link"
              className="ml-4 inline-flex"
              onClick={() => setShowData(!showData)}
            >
              View Page Data
            </Button>
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
            <div>
              <Label htmlFor="image">Hero Image</Label>
              <Input
                type="file"
                accept="image/.png,.jpg,.jpeg,.webp"
                id="image"
                name="image"
                onChange={e => {
                  setData('image', e.target.files[0]);
                  setImage(URL.createObjectURL(e.target.files[0]));
                }}
              />

              {errors.image && (
                <InputError className="mt-2">{errors.image}</InputError>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4 self-center">
          <div className="col-span-1">
            <Label htmlFor="meta_title">Meta Title</Label>

            <Input
              id="meta_title"
              name="meta_title"
              placeholder="enter meta title"
              value={data.meta_title}
              onChange={e => setData('meta_title', e.target.value)}
            />

            {errors.meta_title && (
              <InputError className="mt-2">{errors.meta_title}</InputError>
            )}
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>

            <Textarea
              id="meta_description"
              name="meta_description"
              placeholder="enter meta description"
              rows={5}
              value={data.meta_description}
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
          <div className="relative mx-auto">
            {image && (
              <div className="w-[minmax(auto, 450px)] relative">
                <AspectRatio ratio={16 / 9}>
                  <div className="200ms absolute inset-0 h-full w-full rounded-md bg-slate-800/40 transition-all ease-linear hover:bg-transparent" />
                  <img
                    src={image}
                    alt="post hero"
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
                <XCircleIcon
                  className="absolute right-5 top-5 cursor-pointer text-white"
                  onClick={() => {
                    setImage(null);
                    setData('image', null);
                  }}
                  aria-labelledby="Remove image"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="content">Content</Label>
          <ContentEditor
            name="content"
            id="content"
            initialValue={data.content}
            onChange={(evt, editor) => setData('content', editor.getContent())}
          />

          {errors.content && (
            <InputErrorMessage className="mt-2">
              {errors.content}
            </InputErrorMessage>
          )}
        </div>
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

const ShowPageData = ({ open, onOpenChange, data }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Page Data from the JSON file</AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="max-h-[500px] overflow-auto">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
