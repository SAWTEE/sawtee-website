import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from '@radix-ui/react-icons';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ContentEditor from '@/components/Backend/ContentEditor';
import { MultiSelect } from '@/components/Backend/MultiSelect';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useForm } from '@inertiajs/react';
import React from 'react';

export default function EditArticleForm({ article, tags, volumes }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: article.title,
    slug: article.slug,
    trade_insight_volume_id: article.trade_insight_volume_id ?? null,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    author: article.author,
    tags: [],
    published_at: article.published_at,
    image: article.media?.filter(
      m => m.collection_name === 'article-featured-image'
    )[0],
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    content: article.content,
  });
  const { toast } = useToast();
  const [tagOptions, setTagOptions] = React.useState([]);
  const [image, setImage] = React.useState(
    data.image ? data.image.preview_url : null
  );
  const [articleTags, setArticleTags] = React.useState([]);

  function setDataTags(selectedValues) {
    const array = [];
    selectedValues.map(item => {
      array.push({
        article_id: item.id,
        tag_id: item.value,
      });
    });
    setData('tags', array);
  }

  const [selectedVolume, setSelectedVolume] = React.useState(
    volumes
      ? volumes.filter(volume => volume.id === data.trade_insight_volume_id)[0]
          .id
      : null
  );

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
    post(route('admin.articles.update', {
      _method: 'patch',
      article: article
    }), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Article Created.',
          description: 'Article Created Successfully',
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
    tags.length > 0 &&
      tags.map(tag => {
        setTagOptions(prev => [
          ...prev,
          { value: tag.id, label: tag.name, id: article.id },
        ]);
      });
      const array = [];
    article.tags.map(tag => {
      array.push({ value: tag.id, label: tag.name, id: article.id });
    });
    setArticleTags([...array]);
  }, [tags, article]);


  console.log(articleTags, article);
  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <Label htmlFor="title">Title</Label>

          <Input
            id="title"
            name="title"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            required
          />

          {errors.title && (
            <InputError className="space-y-2">{errors.title}</InputError>
          )}
        </div>

        <div className="col-span-3">
          <Label htmlFor="subtitle">Subtitle</Label>

          <Input
            type="text"
            id="subtitle"
            name="subtitle"
            value={data.subtitle ?? ''}
            onChange={e => setData('subtitle', e.target.value)}
          />

          {errors.subtitle && <InputError>{errors.subtitle}</InputError>}
        </div>

        <div className="col-span-1">
          <div className="mx-2">
            <Label as="legend" htmlFor="published_at">
              Published At
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
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
                  name="published_at"
                  className="mt-1 block"
                  id="published_at"
                  mode="single"
                  selected={data.published_at}
                  onSelect={value => {
                    const formatedDate = format(
                      new Date(value),
                      'yyyy-MM-dd H:i:s'
                    );
                    setData('published_at', formatedDate);
                  }}
                  disabled={date =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {errors.published_at && (
              <InputError className={'mt-2'}>{errors.published_at}</InputError>
            )}
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <div className="col-span-1">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={data.author}
              onChange={e => setData('author', e.target.value)}
            />
            {errors.author && (
              <InputError className="space-y-2">{errors.author}</InputError>
            )}
          </div>

          <div className="col-span-1">
            <fieldset required className="mx-2">
              <Label as="legend" htmlFor="category_id">
                Volume
              </Label>

              <Select
                name="trade_insight_volume_id"
                value={selectedVolume}
                onValueChange={value => {
                  setData('trade_insight_volume_id', Number(value));

                  setSelectedVolume(
                    volumes.filter(vol => vol.id === Number(value))[0]?.volume
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Trade Insight Volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Volumes</SelectLabel>
                  </SelectGroup>

                  {volumes.map(volume => (
                    <SelectItem key={volume.id} value={volume.id}>
                      {volume.volume}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.trade_insight_volume_id && (
                <InputError className={'mt-2'}>
                  {errors.trade_insight_volume_id}
                </InputError>
              )}
            </fieldset>
          </div>
          <div className="cols-span-1">
            <Label htmlFor="tags">Add Tags</Label>

            <MultiSelect
              name={'tags'}
              id="tags"
              defaultValue={articleTags}
              options={tagOptions}
              placeholder="Select Tags"
              variant="inverted"
              maxCount={2}
              onValueChange={setArticleTags}
              setValues={setDataTags}
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={data.excerpt}
            rows={8}
            onChange={e => setData('excerpt', e.target.value)}
          />
          {errors.excerpt && (
            <InputError className="space-y-2">{errors.excerpt}</InputError>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <div className="cols-span-1">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              name="meta_title"
              className="mt-1"
              value={data.meta_title}
              onChange={e => setData('meta_title', e.target.value)}
            />

            <InputError className="mt-2">{errors.meta_title}</InputError>
          </div>

          <div className="cols-span-1">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              className="mt-1 block"
              value={data.meta_description ?? ''}
              rows={8}
              onChange={e => setData('meta_description', e.target.value)}
            />
            <InputError className="mt-2">{errors.meta_description}</InputError>
          </div>
        </div>

        <div className="col-span-2">
          <DropZone
            id="image"
            name="image"
            accept="image/.png,.jpg,.jpeg,.webp"
            defaultValue={image}
            onValueChange={setDataImage}
          />

          {errors.image && (
            <InputError className="space-y-2">{errors.image}</InputError>
          )}
        </div>
        <div className="col-span-4">
          <Label htmlFor="content">Content</Label>

          <ContentEditor
            // type="classic"
            name="content"
            initialValue={data.content ?? ''}
            id="content"
            onChange={(evt, editor) => setData('content', editor.getContent())}
          />

          {errors.content && (
            <InputError className={'mt-2'}>{errors.content}</InputError>
          )}
        </div>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
