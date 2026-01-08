import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ContentEditor from '@/components/Backend/ContentEditor';
import { MultiSelect } from '@/components/ui/multi-select';
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

export default function CreateArticleForm({ tags, volumes }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    slug: '',
    trade_insight_volume_id: 0,
    subtitle: null,
    excerpt: '',
    tags: [],
    author: '',
    published_at: '',
    image: '',
    meta_title: '',
    meta_description: '',
    content: '',
  });
  const { toast } = useToast();
  const [tagOptions, setTagOptions] = React.useState([]);
  const [image, setImage] = React.useState(null);
  const [articleTags, setArticleTags] = React.useState([]);

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
    post(route('admin.articles.store'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Article Created.',
          description: 'Article Created Successfully',
        }),
      onError: errors => {
        for (const key in errors) {
          if (Object.hasOwnProperty.call(errors, key)) {
            if (key !== 'trade_insight_volume_id') continue;
            if (
              key === 'trade_insight_volume_id' &&
              data.trade_insight_volume_id === 0
            ) {
              const value =
                'The trade insight volume id field is required. Please select a volume.';
              reset(key);
              return toast({
                title: 'Uh oh, Something went wrong',
                description: `${key.toUpperCase()} field error ` + `: ${value}`,
              });
            }
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
    tags.length !== tagOptions.length &&
      setTagOptions(tags.map(tag => ({ value: tag.id, label: tag.name })));
  }, [tags]);

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <Label htmlFor="title">Title</Label>

          <Input
            id="title"
            name="title"
            placeholder="enter title"
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
            placeholder="enter subtitle"
            onChange={e => setData('subtitle', e.target.value)}
          />

          {errors.subtitle && <InputError>{errors.subtitle}</InputError>}
        </div>

        <div className="col-span-1">
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

        <div className="col-span-2 flex flex-col gap-4">
          <div className="col-span-1">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              placeholder="enter author names"
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
                value={data.trade_insight_volume_id}
                onValueChange={value => {
                  setData('trade_insight_volume_id', Number(value));

                  setSelectedCategory(
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
                  <SelectItem value={0}>Select Trade Insight Volume</SelectItem>
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
            <Label htmlFor="tags">{' Add Tags'}</Label>

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
            placeholder="enter excerpt"
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
              placeholder="enter meta title"
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
              placeholder="enter meta_description"
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
            initialValue=""
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
