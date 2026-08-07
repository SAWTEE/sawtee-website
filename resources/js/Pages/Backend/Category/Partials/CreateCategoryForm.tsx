import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import DropZone from '@/components/Backend/DropZone';
import FormField from '@/components/Backend/FormField';
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
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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

export default function CreateCategoryForm({
  open = undefined,
  setOpen = undefined,
  categories = undefined,
}: any) {
  const { data, setData, post, errors, reset, progress, processing } = useForm({
    name: '',
    slug: '',
    type: 'post',
    parent_id: '',
    image: '',
    meta_title: '',
    meta_description: '',
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(null);

  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    const array = categories.filter((cat: any) => cat.type === data.type);
    setFilteredCategories(array);
  }, [data.type, categories]);

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
      // @ts-ignore allowlist-migration
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.categories.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Category Created.',
          description: 'Category Created Successfully',
        });
        reset();
        setOpen(false);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create new categoy.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                id="name"
                label="Name"
                error={errors.name}
                required
                className="col-span-4"
              >
                {field => (
                  <Input
                    {...field}
                    name="name"
                    className="col-span-3"
                    placeholder="enter category name"
                    onChange={e => setData('name', e.target.value)}
                  />
                )}
              </FormField>
              <div className="col-span-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>SEO Meta Tags</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col justify-start gap-4">
                        <FormField
                          id="meta_title"
                          label="Meta Title"
                          error={errors.meta_title}
                          className="col-span-4"
                        >
                          {field => (
                            <Input
                              {...field}
                              name="meta_title"
                              className="mt-1"
                              placeholder="enter meta title"
                              onChange={e =>
                                setData('meta_title', e.target.value)
                              }
                            />
                          )}
                        </FormField>

                        <FormField
                          id="meta_description"
                          label="Meta Description"
                          error={errors.meta_description}
                          className="col-span-4"
                        >
                          {field => (
                            <Textarea
                              {...field}
                              name="meta_description"
                              className="mt-1 block"
                              placeholder="enter meta_description"
                              rows={3}
                              onChange={e =>
                                setData('meta_description', e.target.value)
                              }
                            />
                          )}
                        </FormField>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Field
                data-invalid={errors.image || undefined}
                className="col-span-2 gap-2"
              >
                <FieldLabel htmlFor="image">Featured Image</FieldLabel>
                <DropZone
                  htmlFor={'image'}
                  onValueChange={setDataImage}
                  defaultValue={image}
                  error={errors.image}
                  progress={progress}
                  uploading={processing}
                />
              </Field>
              <div className="col-span-2 flex flex-col gap-2">
                <FormField
                  id="type"
                  label="Select Category Type"
                  error={errors.type}
                >
                  {field => (
                    <Select
                      name="type"
                      value={data.type}
                      onValueChange={value => setData('type', value)}
                    >
                      <SelectTrigger
                        id={field.id}
                        aria-invalid={field['aria-invalid']}
                        aria-describedby={field['aria-describedby']}
                      >
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category Types</SelectLabel>
                        </SelectGroup>

                        {['post', 'publication'].map((type: any) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                {['post', 'publication'].includes(data.type) && (
                  <FormField
                    id="parent_id"
                    label="Select Parent"
                    error={errors.parent_id}
                  >
                    {field => (
                      <Select
                        name="parent_id"
                        value={data.parent_id}
                        onValueChange={value => {
                          setData('parent_id', value);
                        }}
                      >
                        <SelectTrigger
                          id={field.id}
                          aria-invalid={field['aria-invalid']}
                          aria-describedby={field['aria-describedby']}
                        >
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="capitalize">{`categories with type ${data.type}`}</SelectLabel>
                          </SelectGroup>
                          {/* @ts-ignore allowlist-migration */}
                          <SelectItem value={null}>Select Parent</SelectItem>
                          {filteredCategories?.map((Category: any) => (
                            <SelectItem
                              key={Category.id}
                              value={Category.id.toString()}
                            >
                              {Category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
