import { useForm } from '@inertiajs/react';
import { CalendarIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import FileUpload, { type ExistingFile } from '@/components/Backend/FileUpload';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { formatDateTimeForInput } from '@/lib/helpers';
import { cn } from '@/lib/utils';

export default function EditPostForm({
  post: postData = undefined,
  categories = undefined,
  tags = undefined,
  themes = undefined,
}: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: postData.title,
    slug: postData.slug,
    category_id: postData.category_id,
    theme_id: postData.theme_id,
    content: postData.content,
    excerpt: postData.excerpt,
    status: postData.status,
    author: postData.author,
    image: postData.media?.filter(
      // @ts-ignore allowlist-migration
      m => m.collection_name === 'post-featured-image'
    )[0],
    tags: [],
    file: null as File | string | null,
    files: [] as File[] | string,
    remove_content_file_ids: [] as number[],
    link: postData.link,
    genre: postData.genre,
    published_at: postData.published_at,
    meta_title: postData.meta_title,
    meta_description: postData.meta_description,
  });

  const { toast } = useToast();
  const [image, setImage] = React.useState(
    data.image ? data.image.preview_url : null
  );
  const existingPostFile = postData.media?.find(
    (m: any) => m.collection_name === 'post-files'
  );
  const [filename, setFilename] = React.useState(
    existingPostFile ? existingPostFile.file_name : null
  );
  const [existingFileUrl, setExistingFileUrl] = React.useState(
    existingPostFile?.original_url ?? existingPostFile?.url ?? null
  );
  const [existingContentFiles, setExistingContentFiles] = React.useState<
    ExistingFile[]
  >(
    (postData.post_content_files ?? []).map((file: any) => ({
      id: file.id,
      name: file.name ?? file.file_name ?? 'File',
      url: file.url ?? file.original_url ?? null,
    }))
  );
  const [postTags, setPostTags] = React.useState([]);
  const tagOptions = (tags ?? []).map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));
  const [selectedCategory, setSelectedCategory] = React.useState(
    categories
      ? categories.filter((cat: any) => cat.id === data.category_id)[0].name
      : null
  );

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
      setData('image', '');
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.posts.update', {
        _method: 'patch',
        post: postData.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Post edited.',
            description: 'Post edited Successfully',
          }),
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  React.useEffect(() => {
    setPostTags(
      (postData.tags ?? []).map((tag: any) => ({
        value: tag.id,
        label: tag.name,
      }))
    );
  }, [postData]);

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 px-4 md:col-span-8">
          <FormField id="title" label="Title" error={errors.title} required>
            {field => (
              <Input
                {...field}
                name="title"
                className="mt-1 block w-full"
                value={data.title}
                autoFocus
                onChange={e => setData('title', e.target.value)}
                autoComplete="title"
              />
            )}
          </FormField>

          <Field data-invalid={errors.content || undefined}>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <ContentEditor
              name="content"
              initialValue={data.content ?? ''}
              id="content"
              onChange={(evt: any, editor: any) => {
                setData('content', editor.getContent());
              }}
            />
            <FieldError>{errors.content}</FieldError>
          </Field>

          <FormField id="excerpt" label="Excerpt" error={errors.excerpt}>
            {field => (
              <Textarea
                {...field}
                value={data.excerpt ?? ''}
                className="mt-1 block w-full"
                rows={8}
                onChange={e => setData('excerpt', e.target.value)}
              />
            )}
          </FormField>
        </div>

        <div className="col-span-12 flex flex-col gap-8 px-3 md:col-span-4">
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
            label="Published At"
            error={errors.published_at}
            className="mx-2"
          >
            {field => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={field.id}
                    aria-invalid={field['aria-invalid']}
                    aria-describedby={field['aria-describedby']}
                    variant={'outline'}
                    className={cn(
                      'mt-1 flex w-full pl-3 text-left font-normal',
                      !data.published_at && 'text-muted-foreground'
                    )}
                  >
                    {data.published_at ? (
                      new Date(data.published_at).toDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="mt-1 block"
                    mode="single"
                    selected={
                      data.published_at
                        ? new Date(data.published_at)
                        : undefined
                    }
                    onSelect={value => {
                      if (!value) {
                        return;
                      }

                      setData('published_at', formatDateTimeForInput(value));
                    }}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                    className="flex w-[auto] items-center space-x-2"
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
                        Add author name, if multple authors use comma seperated
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
                  value={data.author ?? ''}
                  className="mt-1 block"
                  placeholder="Add author full name"
                  autoComplete="author"
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
                  value={data.genre ?? ''}
                  className="mt-1 block"
                  autoComplete="genre"
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
                  value={data.link ?? ''}
                  className="mt-1 block"
                  autoComplete="link"
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
                        value={data.meta_title}
                        className="mt-1 block"
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
                        className="mt-1 block"
                        value={data.meta_description ?? ''}
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
          <Accordion type="single" collapsible>
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
          <Accordion type="single" collapsible>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex gap-2">
                  {'Upload files'}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Upload files associated with this post
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
                      existing={
                        filename
                          ? { name: filename, url: existingFileUrl }
                          : null
                      }
                      progress={progress}
                      error={errors.file}
                      onChange={file => {
                        const next = Array.isArray(file)
                          ? (file[0] ?? '')
                          : (file ?? '');
                        setData('file', next);
                        if (next instanceof File) {
                          setFilename(next.name);
                          setExistingFileUrl(null);
                        } else {
                          setFilename(null);
                          setExistingFileUrl(null);
                        }
                      }}
                      onRemove={() => {
                        setData('file', '');
                        setFilename(null);
                        setExistingFileUrl(null);
                      }}
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
                      existing={existingContentFiles}
                      progress={progress}
                      error={errors.files}
                      onChange={files =>
                        setData(
                          'files',
                          Array.isArray(files) ? files : files ? [files] : []
                        )
                      }
                      onExistingChange={next => {
                        const removedIds = existingContentFiles
                          .filter(
                            file =>
                              file.id != null &&
                              !next.some(kept => kept.id === file.id)
                          )
                          .map(file => Number(file.id));

                        setExistingContentFiles(next);
                        setData('remove_content_file_ids', [
                          ...data.remove_content_file_ids,
                          ...removedIds.filter(
                            id => !data.remove_content_file_ids.includes(id)
                          ),
                        ]);
                      }}
                      onRemove={() => {
                        // Empty string marks full clear for mediaWasCleared('files').
                        setData('files', '');
                        setData('remove_content_file_ids', []);
                        setExistingContentFiles([]);
                      }}
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
