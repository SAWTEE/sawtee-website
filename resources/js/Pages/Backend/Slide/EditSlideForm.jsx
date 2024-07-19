import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function EditSlideForm({ open, setOpen, slide, setEditSlide }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: slide.title,
    subtitle: slide.subtitle,
    slider_id: slide.slider_id,
    image: slide.media[0] ? slide.media[0].original_url : null,
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(data.image);
  const [files, setFiles] = useState(slide.media[0] ? slide.media : []);

  function setDataImage(array) {
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(array[0]);
    setData('image', array[0]);
  }

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
        onError: errors => {
          if (errors.title) {
            reset('title');
          }
        },
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
        <form onSubmit={submit}>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                name="title"
                placeholder="enter title"
                value={data.title}
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
                value={data.subtitle}
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
                files={files}
                setFiles={setFiles}
                className={image ? 'hidden' : 'h-48'}
              />
              {image && (
                <div className="relative  flex flex-col items-center justify-center w-full h-48 rounded-xl overflow-hidden cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-200 p-4 border-2 border-slate-700 border-dashed dark:border-gray-600 dark:hover:border-gray-500 ">
                  <div className="w-full h-full absolute inset-0">
                    <AspectRatio ratio={5 / 3}>
                      <img
                        src={image}
                        alt="section hero"
                        className="rounded-md object-cover w-full h-full "
                      />
                    </AspectRatio>
                    <Button
                      className="absolute top-2 right-2 rounded-lg"
                      onClick={() => {
                        setImage(null);
                        setFiles([]);
                        setData('image', null);
                      }}
                    >
                      <XIcon className=" w-6 h-6 " />
                    </Button>
                  </div>
                </div>
              )}
              {errors.image && <InputError mt={2}>{errors.image}</InputError>}
            </div>
            <div>
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
              <Button
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
