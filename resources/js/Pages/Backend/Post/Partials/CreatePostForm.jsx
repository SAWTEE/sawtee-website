import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { MultiSelect } from '@/components/ui/multi-select';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function CreatePostForm({ categories, themes, tags }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    category_id: 1,
    theme_id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    status: 'unpublished',
    image: '',
    file: '',
    files: [],
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
  const [tagOptions, setTagOptions] = React.useState([]);
  const [image, setImage] = React.useState(null);
  const [postTags, setPostTags] = React.useState([]);

  // function setDataTags(selectedValues) {
  //   const array = [];
  //   selectedValues.map(item => {
  //     array.push({
  //       post_id: item.id,
  //       tag_id: item.value,
  //     });
  //   });
  //   setData('tags', array);
  // }

  function setDataTags(selectedValues) {
    const tagIds = selectedValues.map(item => item.value);
    setData('tags', tagIds);
  }

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

  const submit = e => {
    e.preventDefault();
    post(route('admin.posts.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () =>
        toast({
          title: 'Post Created.',
          description: `${data.title} post was created successfully`,
        }),
      onError: errors => {
        for (const key in errors) {
          if (Object.hasOwnProperty.call(errors, key)) {
            const value = errors[key];
            reset(key);
            return toast({
              title: 'Uh oh, Something went wrong',
              description: `${key.toUpperCase()} field error ` + `: ${value}`,
            });
          }
        }
      },
    });
  };

  React.useEffect(() => {
    tags.length !== tagOptions.length && setTagOptions(tags.map(tag => ({ value: tag.id, label: tag.name })));
  }, [tags]);

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col gap-8 px-4 md:col-span-8">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              className={`${errors.title ? 'border-red-500' : ''}`}
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              required
            />
            {errors.title && (
              <InputError className="mt-2" message={errors.title} />
            )}
          </div>
          <div mt={4}>
            <Label htmlFor="content">Content</Label>

            <ContentEditor
              // type="classic"
              name="content"
              initialValue=""
              id="content"
              onChange={(evt, editor) =>
                setData('content', editor.getContent())
              }
            />

            {errors.content && (
              <InputError className={'mt-2'}>{errors.content}</InputError>
            )}
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              className="mt-1 block w-full"
              rows={8}
              onChange={e => setData('excerpt', e.target.value)}
              required
            />

            {errors.excerpt && (
              <InputError className={'mt-2'}>{errors.excerpt}</InputError>
            )}
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-8 px-3 md:col-span-4 lg:sticky lg:top-16">
          <fieldset required className="mx-2">
            <Label as="legend" htmlFor="category_id">
              Category
            </Label>

            <Select
              name="category_id"
              value={data.category_id}
              onValueChange={value => {
                setData('category_id', Number(value));

                setSelectedCategory(
                  categories.filter(cat => cat.id === Number(value))[0]?.name
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                </SelectGroup>

                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category_id && (
              <InputError className={'mt-2'}>{errors.category_id}</InputError>
            )}
          </fieldset>
          <div className="mx-2">
            <Label as="legend" htmlFor="published_at">
              Published at
            </Label>

            <Input
              type="date"
              className="mt-1 block"
              placeholder="Select Date"
              id="published_at"
              name="published_at"
              onChange={e => {
                setData('published_at', e.target.value);
              }}
            />

            {errors.published_at && (
              <InputError className={'mt-2'}>{errors.published_at}</InputError>
            )}
          </div>
          <fieldset required className="mx-2">
            <Label as="legend" htmlFor="status">
              Status
            </Label>

            <RadioGroup
              className="mt-1 flex flex-wrap gap-4"
              defaultValue={data.status}
              onValueChange={value => {
                setData('status', value);
              }}
            >
              {['unpublished', 'draft', 'published'].map(item => {
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

            {errors.status && (
              <InputError className={'mt-2'}>{errors.status}</InputError>
            )}
          </fieldset>
          <div className="mx-2">
            <Label htmlFor="image">Featured Image</Label>

            <DropZone
              htmlFor={'image'}
              onValueChange={setDataImage}
              defaultValue={image}
            />
          </div>
          {['Covid', 'Opinion in Lead', 'Blog'].includes(selectedCategory) && (
            <div className="mx-2">
              <TooltipProvider>
                <Label htmlFor="author">
                  {'Author/s '}
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkCircledIcon className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Add author name, if multple authors use comma seperated
                      format. Eg: Paras Kharel, Dikshya Singh, Kshitiz Dahal
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </TooltipProvider>
              <Input
                type="text"
                id="author"
                name="author"
                className="mt-1 block"
                placeholder="Add author full name"
                autoComplete="author"
                onChange={e => setData('author', e.target.value)}
              />

              {errors.author && (
                <InputError className={'mt-2'}>{errors.author}</InputError>
              )}
            </div>
          )}
          {selectedCategory === 'Covid' && (
            <div className="mx-2">
              <Label htmlFor="genre">Genre</Label>

              <Input
                type="text"
                id="genre"
                name="genre"
                className="mt-1 block"
                autoComplete="genre"
                onChange={e => setData('genre', e.target.value)}
              />

              {errors.genre && (
                <InputError className={'mt-2'}>{errors.genre}</InputError>
              )}
            </div>
          )}
          {[
            'Covid',
            'Opinion in Lead',
            'Webinar Series',
            'LDC Graduations',
          ].includes(selectedCategory) && (
            <div className="mx-2">
              <Label htmlFor="link">External Link</Label>

              <Input
                type="text"
                id="link"
                name="link"
                className="mt-1 block"
                autoComplete="link"
                onChange={e => setData('link', e.target.value)}
              />

              {errors.author && (
                <InputError className={'mt-2'}>{errors.author}</InputError>
              )}
            </div>
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
                  <div className="mx-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      className="mt-1"
                      placeholder="enter meta title"
                      onChange={e => setData('meta_title', e.target.value)}
                    />

                    <InputError className="mt-2">
                      {errors.meta_title}
                    </InputError>
                  </div>

                  <div className="mx-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      className="mt-1 block"
                      placeholder="enter meta_description"
                      rows={3}
                      onChange={e =>
                        setData('meta_description', e.target.value)
                      }
                    />
                    <InputError className="mt-2">
                      {errors.meta_description}
                    </InputError>
                  </div>
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
                  <fieldset className="mx-2">
                    <Label as="legend" htmlFor="theme_id">
                      Theme
                    </Label>

                    <Select
                      name="theme_id"
                      value={data.theme_id}
                      onValueChange={value => {
                        setData('theme_id', Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Themes</SelectLabel>
                          {themes?.map(theme => (
                            <SelectItem key={theme.id} value={theme.id}>
                              {theme.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {errors.theme_id && (
                      <InputError className={'mt-2'}>
                        {errors.theme_id}
                      </InputError>
                    )}
                  </fieldset>

                  <div className="mx-2">
                    <Label htmlFor="tags">{' Add Tags'}</Label>

                    <MultiSelect
                      name={'tags'}
                      id="tags"
                      defaultValue={postTags}
                      options={tagOptions}
                      placeholder="Select Tags"
                      variant="inverted"
                      maxCount={2}
                      onValueChange={setPostTags}
                      setValues={setDataTags}
                    />
                  </div>
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
                    <Label htmlFor="file">File Upload</Label>
                    <Input
                      type="file"
                      accept=".pdf,.docx,.pptx"
                      className="mt-1"
                      id="file"
                      name="file"
                      onChange={e => {
                        setData('file', e.target.files[0]);
                      }}
                    />
                  </div>

                  <div className="mx-2">
                    <Label htmlFor="files">Content Files Upload</Label>

                    <Input
                      type="file"
                      multiple
                      className="mt-1"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      id="files"
                      name="files"
                      onChange={e => {
                        setData('files', Array.from(e.target.files));
                      }}
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
