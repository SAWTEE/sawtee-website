import { useForm } from '@inertiajs/react';
import React from 'react';

import DropZone from '@/components/Backend/DropZone';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditSlideForm({
  open = undefined,
  setOpen = undefined,
  slide = undefined,
  setEditSlide = undefined,
}: any) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: slide.title,
    subtitle: slide.subtitle,
    slider_id: slide.slider_id,
    image: slide.media[0] ? slide.media[0].original_url : null,
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(data.image);

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
      route('admin.slides.update', {
        _method: 'PATCH',
        slide: slide.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Slide Created.',
            description: 'Slide Created Successfully',
          });
          setEditSlide(null);
          setOpen(!open);
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slide</DialogTitle>
          <DialogDescription>Change slide data.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="flex flex-col gap-4">
            <FormField id="title" label="Title" error={errors.title}>
              {field => (
                <Input
                  {...field}
                  name="title"
                  placeholder="enter title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>

            <FormField id="subtitle" label="Subtitle" error={errors.subtitle}>
              {field => (
                <Input
                  {...field}
                  name="subtitle"
                  placeholder="enter subtitle"
                  value={data.subtitle}
                  onChange={e => setData('subtitle', e.target.value)}
                />
              )}
            </FormField>

            <Field data-invalid={errors.image || undefined} className="gap-2">
              <FieldLabel htmlFor="image">Slide Image</FieldLabel>
              <DropZone
                htmlFor={'image'}
                onValueChange={setDataImage}
                defaultValue={image}
                error={errors.image}
                progress={progress}
                uploading={processing}
              />
            </Field>
            <div>
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
              <Button
                // @ts-ignore allowlist-migration
                variant="solid"
                colorScheme="red"
                onClick={() => setOpen(!open)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
