import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

function CreateSlideForm({ open = undefined, setOpen = undefined, slider = undefined }: any) {
  const { setData, post, processing, errors, reset } = useForm({
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
        setImage(null);
        setOpen(!open);
      },
      onError: errors => {
        if (errors.title) {
          reset('title');
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slide</DialogTitle>
          <DialogDescription>Add new slide.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                name="title"
                placeholder="enter title"
                onChange={e => setData('title', e.target.value)}
              />

              {errors.title && (
                <InputError className="mt-2">{errors.title}</InputError>
              )}
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>

              <Input
                id="subtitle"
                name="subtitle"
                placeholder="enter subtitle"
                onChange={e => setData('subtitle', e.target.value)}
              />
              {errors.subtitle && (
                <InputError className="mt-2">{errors.subtitle}</InputError>
              )}
            </div>

            <div>
              <Label htmlFor="image">Slide Image</Label>
              <DropZone
                htmlFor={'image'}
                onValueChange={setDataImage}
                defaultValue={image}
              />

              {/* @ts-ignore allowlist-migration */}
              {errors.image && <InputError mt={2}>{errors.image}</InputError>}
            </div>
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
