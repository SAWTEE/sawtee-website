import { useForm } from '@inertiajs/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreatePostForm({
  categories = undefined,
  themes = undefined,
  tags = undefined,
}: any) {
  const { data, setData, post, processing, errors, reset, progress } = useForm({
    category_id: 1,
    theme_id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    status: 'unpublished',
    image: '',
    file: null as any,
    files: [] as any,
    tags: [],
    link: null,
    genre: '',
    published_at: null,
    meta_title: '',
    meta_description: '',
  });
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] =
    React.useState('Featured Events');
  const tagOptions = (tags ?? []).map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));
  const [image, setImage] = React.useState(null);
  const [postTags, setPostTags] = React.useState([]);

  function setDataTags(selectedValues: any) {
    const tagIds = selectedValues.map((item: any) => item.value);
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
      // @ts-ignore allowlist-migration
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.posts.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast({
          title: 'Post Created.',
          description: `${data.title} post was created successfully`,
        });
        reset();
        setImage(null);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 px-4 md:col-span-8">
          <FormField id="title" label="Title" error={errors.title} required>
            {field => (
              <Input
                {...field}
                placeholder="Title for the post"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
            )}
          </FormField>

          <Field data-invalid={errors.content || undefined}>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <ContentEditor
              name="content"
              initialValue=""
              id="content"
              onChange={(evt: any, editor: any) =>
                setData('content', editor.getContent())
              }
            />
            <FieldError>{errors.content}</FieldError>
          </Field>

          <FormField id="excerpt" label="Excerpt" error={errors.excerpt} required>
            {field => (
              <Textarea
                {...field}
                className="mt-1 block w-full"
                rows={8}
                value={data.excerpt}
                onChange={e => setData('excerpt', e.target.value)}
              />
            )}
          </FormField>
        </div>

        <div className="col-span-12 flex flex-col gap-8 px-3 md:col-span-4 lg:sticky lg:top-16">
          <FormField
            id="category_id"
            label="Category"
            error={errors.category_id}
            required
            className="mx-2"
          >
            {field => (
              <Select
                name="category_id"
                // @ts-ignore allowlist-migration
                value={data.category_id}
                onValueChange={value => {
                  setData('category_id', Number(value));

                  setSelectedCategory(
                    categories.filter((cat: any) => cat.id === Number(value))[0]
                      ?.name
                  );
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

          <FormField
            id="published_at"
            label="Published at"
            error={errors.published_at}
            className="mx-2"
          >
            {field => (
              <Input
                {...field}
                type="date"
                className="mt-1 block"
                placeholder="Select Date"
                name="published_at"
                onChange={e => {
                  // @ts-ignore allowlist-migration
                  setData('published_at', e.target.value);
                }}
              />
            )}
          </FormField>

          <Field
            data-invalid={errors.status || undefined}
            className="mx-2 gap-2"
          >
            <FieldLabel htmlFor="status">
              Status <span className="text-destructive">*</span>
            </FieldLabel>
            <RadioGroup
              className="mt-1 flex flex-wrap gap-4"
              defaultValue={data.status}
              onValueChange={value => {
                setData('status', value);
              }}
            >
              {['unpublished', 'draft', 'published'].map((item: any) => {
                return (
                  <div
                    key={item}
                    className="flex w-auto items-center space-x-2"
                  >
                    <RadioGroupItem value={item} id={item} />
                    <Label className="capitalize" htmlFor={item}>
                      {item}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            <FieldError>{errors.status}</FieldError>
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

          {['Covid', 'Opinion in Lead', 'Blog'].includes(selectedCategory) && (
            <FormField
              id="author"
              label={
                <TooltipProvider>
                  <span className="inline-flex items-center gap-1">
                    Author/s{' '}
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <QuestionMarkCircledIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Add author name, if multiple authors use comma separated
                        format. Eg: Paras Kharel, Dikshya Singh, Kshitiz Dahal
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </TooltipProvider>
              }
              error={errors.author}
              className="mx-2"
            >
              {field => (
                <Input
                  {...field}
                  type="text"
                  name="author"
                  className="mt-1 block"
                  placeholder="Add author full name"
                  autoComplete="author"
                  value={data.author}
                  onChange={e => setData('author', e.target.value)}
                />
              )}
            </FormField>
          )}

          {selectedCategory === 'Covid' && (
            <FormField
              id="genre"
              label="Genre"
              error={errors.genre}
              className="mx-2"
            >
              {field => (
                <Input
                  {...field}
                  type="text"
                  name="genre"
                  className="mt-1 block"
                  autoComplete="genre"
                  value={data.genre}
                  onChange={e => setData('genre', e.target.value)}
                />
              )}
            </FormField>
          )}

          {[
            'Covid',
            'Opinion in Lead',
            'Webinar Series',
            'LDC Graduations',
          ].includes(selectedCategory) && (
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
                  className="mt-1 block"
                  autoComplete="link"
                  // @ts-ignore allowlist-migration
                  value={data.link ?? ''}
                  // @ts-ignore allowlist-migration
                  onChange={e => setData('link', e.target.value)}
                />
              )}
            </FormField>
          )}

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
                    className="mx-2"
                  >
                    {field => (
                      <Textarea
                        {...field}
                        name="meta_description"
                        className="mt-1 block"
                        placeholder="enter meta_description"
                        rows={3}
                        value={data.meta_description}
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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex gap-2">
                  Optional Fields
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add theme and post tags for this post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col justify-start gap-4">
                  <FormField
                    id="theme_id"
                    label="Theme"
                    error={errors.theme_id}
                    className="mx-2"
                  >
                    {field => (
                      <Select
                        name="theme_id"
                        value={data.theme_id}
                        onValueChange={value => {
                          // @ts-ignore allowlist-migration
                          setData('theme_id', Number(value));
                        }}
                      >
                        <SelectTrigger
                          id={field.id}
                          aria-invalid={field['aria-invalid']}
                          aria-describedby={field['aria-describedby']}
                        >
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Themes</SelectLabel>
                            {themes?.map((theme: any) => (
                              <SelectItem key={theme.id} value={theme.id}>
                                {theme.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <Field className="mx-2 gap-2">
                    <FieldLabel htmlFor="tags">Add Tags</FieldLabel>
                    <MultiSelect
                      name={'tags'}
                      id="tags"
                      defaultValue={postTags}
                      options={tagOptions}
                      placeholder="Select Tags"
                      variant="inverted"
                      maxCount={2}
                      // @ts-ignore allowlist-migration
                      onValueChange={setPostTags}
                      setValues={setDataTags}
                    />
                  </Field>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex gap-2">
                  Upload File/Files
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add post and post content attachments </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col justify-start gap-8">
                  <div className="mx-2">
                    <FileUpload
                      id="file"
                      name="file"
                      label="File Upload"
                      accept=".pdf,.docx,.pptx"
                      value={data.file instanceof File ? data.file : null}
                      progress={progress}
                      error={errors.file}
                      onChange={file => setData('file', file ?? '')}
                      onRemove={() => setData('file', '')}
                      uploading={processing}
                    />
                  </div>

                  <div className="mx-2">
                    <FileUpload
                      id="files"
                      name="files"
                      label="Content Files Upload"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      value={
                        Array.isArray(data.files) &&
                        data.files[0] instanceof File
                          ? data.files
                          : null
                      }
                      progress={progress}
                      error={errors.files}
                      onChange={files => setData('files', files ?? [])}
                      onRemove={() => setData('files', [])}
                      uploading={processing}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <PrimaryButton
            type="submit"
            className="text-center"
            disabled={processing}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
