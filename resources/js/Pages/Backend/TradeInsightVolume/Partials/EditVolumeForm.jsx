import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ContentEditor from '@/components/Backend/ContentEditor';


import { useForm } from '@inertiajs/react';
import React from 'react';

export default function EditVolumeForm({volume}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    volume: volume.volume,
    title: volume.title,
    slug: volume.slug,
    description: volume.description,
    subtitle: volume.subtitle,
    content: volume.content,
    full_article_link: volume.full_article_link,
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();
    post(
      route('admin.trade-insight-volumes.update', {
        _method: 'patch',
        trade_insight_volume: volume.id,
      }), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Trade insight volume Updated.',
          description: 'Trade insight volume updated Successfully',
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

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <Label htmlFor="volume">Volume</Label>

          <Input
            id="volume"
            name="volume"
            value={data.volume}
            onChange={e => setData('volume', e.target.value)}
            required
          />

          {errors.volume && <InputError mt={2}>{errors.volume}</InputError>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="title">Title</Label>

          <Input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
          />

          {errors.title && <InputError>{errors.title}</InputError>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={data.subtitle}
            onChange={e => setData('subtitle', e.target.value)}
          />
          {errors.subtitle && (
            <InputError mt={2}>{errors.subtitle}</InputError>
          )}
        </div>

<div className="col-span-2">
          <Label htmlFor="link">Full article link</Label>
          <Input
            id="link"
            name="link"
            value={data.full_link_article}
            onChange={e => setData('link', e.target.value)}
          />
          {errors.full_article_link && (
            <InputError mt={2}>{errors.full_article_link}</InputError>
          )}
        </div>
        <div className="col-span-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={data.description}
            rows={8}
            onChange={e => setData('description', e.target.value)}
          />
          {errors.description && <InputError mt={2}>{errors.description}</InputError>}
        </div>

        <div className="col-span-4">
            <Label htmlFor="content">Content</Label>

            <ContentEditor
              // type="classic"
              name="content"
              initialValue={data.content}
              id="content"
              onChange={(evt, editor) =>
                setData('content', editor.getContent())
              }
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
