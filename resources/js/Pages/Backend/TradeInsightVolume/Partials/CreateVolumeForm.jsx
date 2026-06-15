import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';

import { useForm } from '@inertiajs/react';
import React from 'react';

export default function CreateVolumeForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    volume: '',
    slug: '',
    content: '',
    image: '',
    full_article_link: '',
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(null);

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
    post(route('admin.trade-insight-volumes.store'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Trade insight volume Created.',
          description: 'Trade insight volume Created Successfully',
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
        <div className="col-span-4 flex flex-col gap-4 md:flex-row md:items-center lg:items-stretch lg:gap-4">
          <div className="w-full">
            <Label htmlFor="volume">Volume</Label>

            <Input
              id="volume"
              name="volume"
              placeholder="enter trade insight volume"
              onChange={e => setData('volume', e.target.value)}
              required
            />

            {errors.volume && <InputError mt={2}>{errors.volume}</InputError>}
          </div>
          <div className="w-full">
            <Label htmlFor="link">Download Link</Label>
            <Input
              id="link"
              name="link"
              placeholder="enter link"
              onChange={e => setData('link', e.target.value)}
            />
            {errors.full_article_link && (
              <InputError mt={2}>{errors.full_article_link}</InputError>
            )}
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
