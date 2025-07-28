import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function EditCategoryForm({
  open,
  setOpen,
  category,
  categories,
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: category.name,
    type: category.type,
    slug: category.slug,
    parent_id: category.parent_id,
    image: category?.media.length > 0 ? category.media[0].preview_url : null,
    meta_title: category.meta_title,
    meta_description: category.meta_description,
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(data.image);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    const array = categories.filter(cat => cat.type === data.type);
    setFilteredCategories(array);
  }, [data.type, categories]);

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
    post(
      route('admin.categories.update', {
        _method: 'patch',
        category: category.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Category edited.',
            description: 'Category edited Successfully',
          });
          setOpen(!open);
        },
        onError: errors => {
          for (const key in errors) {
            if (Object.hasOwnProperty.call(errors, key)) {
              const value = errors[key];
              reset(key);
              return toast({
                title: 'Uh oh, Something went wrong',
                variant: 'destructive',
                description: `${key.toUpperCase()} field error` + `: ${value}`,
              });
            }
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit categoy</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={data.name}
                  placeholder="enter category name"
                  onChange={e => setData('name', e.target.value)}
                  required
                />

                {errors.name && (
                  <InputError className="mt-2">{errors.name}</InputError>
                )}
              </div>

              <div className="col-span-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>SEO Meta Tags</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col justify-start gap-4">
                        <div className="col-span-4">
                          <Label htmlFor="meta_title">Meta Title</Label>
                          <Input
                            id="meta_title"
                            name="meta_title"
                            className="mt-1"
                            value={data.meta_title}
                            placeholder="enter meta title"
                            onChange={e =>
                              setData('meta_title', e.target.value)
                            }
                          />

                          <InputError className="mt-2">
                            {errors.meta_title}
                          </InputError>
                        </div>

                        <div className="col-span-4">
                          <Label htmlFor="meta_description">
                            Meta Description
                          </Label>
                          <Textarea
                            id="meta_description"
                            name="meta_description"
                            className="mt-1 block"
                            value={data.meta_description}
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
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label htmlFor="image">Featured Image</Label>

                <DropZone
                  htmlFor={'image'}
                  onValueChange={setDataImage}
                  defaultValue={image}
                  //   className="h-64"
                />

                {errors.image && (
                  <InputError className="mt-2">{errors.image}</InputError>
                )}
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <div className="col-span-2">
                  <Label htmlFor="type">Select Category Type</Label>
                  <Select
                    name="type"
                    value={data.type}
                    onValueChange={value => setData('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category Types</SelectLabel>
                      </SelectGroup>

                      {['post', 'publication', 'research', 'team'].map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {['post', 'publication'].includes(data.type) && (
                  <div className="col-span-2">
                    <Label htmlFor="parent_id">Select Parent</Label>
                    <Select
                      name="parent_id"
                      value={data.parent_id}
                      onValueChange={value => {
                        setData('parent_id', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Parent</SelectLabel>
                        </SelectGroup>
                        <SelectItem value={null}>Select Parent</SelectItem>
                        {filteredCategories?.map(Category => (
                          <SelectItem
                            key={Category.id}
                            value={Category.id.toString().toString()}
                          >
                            {Category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <PrimaryButton
              type="submit"
              disabled={processing}
              isLoading={processing}
            >
              Save changes
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
