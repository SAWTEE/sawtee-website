import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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

function CreateSlideForm({
  open = undefined,
  setOpen = undefined,
  slider = undefined,
}: any) {
  const { setData, post, processing, errors, reset, progress } = useForm({
    title: '',
    subtitle: '',
    slider_id: slider.id,
  });
  const { toast } = useToast();
  const [image, setImage] = useState(null);

  function setDataImage(image: any) {
    if (image) {
      const reader = new FileReader();
      reader.onload = e => {
        // @ts-ignore allowlist-migration
        setImage(e.target.result);
      };
      reader.readAsDataURL(image);
      // @ts-ignore allowlist-migration
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

    post(route('admin.slides.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Slide Created.',
          description: 'Slide Created Successfully',
        });
        reset();
        setImage(null);
        setOpen(!open);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slide</DialogTitle>
          <DialogDescription>Add new slide.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="flex flex-col gap-4">
            <FormField id="title" label="Title" error={errors.title}>
              {field => (
                <Input
                  {...field}
                  name="title"
                  placeholder="enter title"
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
                  onChange={e => setData('subtitle', e.target.value)}
                />
              )}
            </FormField>

            <Field data-invalid={(errors as any).image || undefined} className="gap-2">
              <FieldLabel htmlFor="image">Slide Image</FieldLabel>
              <DropZone
                htmlFor={'image'}
                onValueChange={setDataImage}
                defaultValue={image}
                error={(errors as any).image}
                progress={progress}
                uploading={processing}
              />
            </Field>
            <div className="space-x-2">
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
              <Button variant="ghost" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSlideForm;
