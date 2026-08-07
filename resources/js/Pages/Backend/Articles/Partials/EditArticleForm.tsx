import { useForm } from '@inertiajs/react';
import React from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DatePicker from '@/components/Backend/DatePicker';
import DropZone from '@/components/Backend/DropZone';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditArticleForm({
  article = undefined,
  tags = undefined,
  volumes = undefined,
}: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: article.title,
    slug: article.slug,
    publication_id: article.publication_id ?? null,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    author: article.author,
    tags: [],
    published_at: article.published_at,
    image: article.media?.filter(
      // @ts-ignore allowlist-migration
      m => m.collection_name === 'article-featured-image'
    )[0],
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    content: article.content,
  });
  const { toast } = useToast();
  const tagOptions = (tags ?? []).map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));
  const [image, setImage] = React.useState(
    data.image ? data.image.preview_url : null
  );
  const [articleTags, setArticleTags] = React.useState([]);

  function setDataTags(selectedValues: any) {
    const tagIds = selectedValues.map((item: any) => item.value);
    setData('tags', tagIds);
  }

  const [selectedVolume, setSelectedVolume] = React.useState(
    volumes
      ? volumes.filter((volume: any) => volume.id === data.publication_id)[0].id
      : null
  );

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
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.articles.update', {
        _method: 'patch',
        article: article,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            title: 'Article Edited.',
            description: 'Article edited Successfully',
          }),
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  React.useEffect(() => {
    setArticleTags(
      article.tags.map((tag: any) => ({ value: tag.id, label: tag.name }))
    );
    setData(
      'tags',
      article.tags.map((tag: any) => tag.id)
    );
  }, [article, setData]);

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          id="title"
          label="Title"
          error={errors.title}
          required
          className="col-span-4"
        >
          {field => (
            <Input
              {...field}
              name="title"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="subtitle"
          label="Subtitle"
          error={errors.subtitle}
          className="col-span-3"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="subtitle"
              value={data.subtitle ?? ''}
              onChange={e => setData('subtitle', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="published_at"
          label="Published At"
          error={errors.published_at}
          className="col-span-1 mx-2"
        >
          {field => (
            <DatePicker
              {...field}
              value={data.published_at}
              placeholder="Select publish date"
              fromYear={1990}
              toYear={new Date().getFullYear() + 1}
              onChange={value => setData('published_at', value)}
            />
          )}
        </FormField>

        <div className="col-span-2 flex flex-col gap-4">
          <FormField id="author" label="Author" error={errors.author}>
            {field => (
              <Input
                {...field}
                name="author"
                value={data.author}
                onChange={e => setData('author', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="publication_id"
            label="Volume"
            error={
              // @ts-ignore allowlist-migration
              errors.trade_insight_volume_id || errors.publication_id
            }
            required
            className="mx-2"
          >
            {field => (
              <Select
                name="trade_insight_volume_id"
                value={selectedVolume}
                onValueChange={value => {
                  // @ts-ignore allowlist-migration
                  setData('trade_insight_volume_id', Number(value));

                  setSelectedVolume(
                    volumes.filter((vol: any) => vol.id === Number(value))[0]
                      ?.volume
                  );
                }}
              >
                <SelectTrigger
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
                  <SelectValue placeholder="Select Trade Insight Volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Volumes</SelectLabel>
                  </SelectGroup>

                  {volumes.map((volume: any) => (
                    <SelectItem key={volume.id} value={volume.id}>
                      {volume.volume}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>

          <Field className="gap-2">
            <FieldLabel htmlFor="tags">Add Tags</FieldLabel>
            <MultiSelect
              name={'tags'}
              id="tags"
              defaultValue={articleTags}
              options={tagOptions}
              placeholder="Select Tags"
              variant="inverted"
              maxCount={2}
              // @ts-ignore allowlist-migration
              onValueChange={setArticleTags}
              setValues={setDataTags}
            />
          </Field>
        </div>

        <FormField
          id="excerpt"
          label="Excerpt"
          error={errors.excerpt}
          className="col-span-2"
        >
          {field => (
            <Textarea
              {...field}
              name="excerpt"
              value={data.excerpt}
              rows={8}
              onChange={e => setData('excerpt', e.target.value)}
            />
          )}
        </FormField>

        <div className="col-span-2 flex flex-col gap-4">
          <FormField
            id="meta_title"
            label="Meta Title"
            error={errors.meta_title}
          >
            {field => (
              <Input
                {...field}
                name="meta_title"
                className="mt-1"
                value={data.meta_title}
                onChange={e => setData('meta_title', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="meta_description"
            label="Meta Description"
            error={errors.meta_description}
          >
            {field => (
              <Textarea
                {...field}
                name="meta_description"
                className="mt-1 block"
                value={data.meta_description ?? ''}
                rows={8}
                onChange={e => setData('meta_description', e.target.value)}
              />
            )}
          </FormField>
        </div>

        <Field
          data-invalid={errors.image || undefined}
          className="col-span-2 gap-2"
        >
          <DropZone
            id="image"
            name="image"
            defaultValue={image}
            onValueChange={setDataImage}
            error={errors.image}
            progress={progress}
            uploading={processing}
          />
        </Field>

        <Field
          data-invalid={errors.content || undefined}
          className="col-span-4"
        >
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <ContentEditor
            name="content"
            initialValue={data.content ?? ''}
            id="content"
            onChange={(evt: any, editor: any) =>
              setData('content', editor.getContent())
            }
          />
          <FieldError>{errors.content}</FieldError>
        </Field>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
