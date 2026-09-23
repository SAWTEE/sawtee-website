import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateFeature({
  open = undefined,
  setOpen = undefined,
}: any) {
  const { data, setData, post, processing, errors, reset } = useForm({
    key: '',
    title: '',
    description: '',
    image_src: '',
    link: '',
    sort_order: 0,
    is_active: true,
  });

  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.features.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Feature Created.',
          description: 'New feature added successfully',
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
          <DialogTitle>Create feature</DialogTitle>
          <DialogDescription>
            Add a home-page feature card. Leave the key blank to generate one
            from the title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <FormField id="title" label="Title" error={errors.title} required>
              {field => (
                <Input
                  {...field}
                  name="title"
                  placeholder="enter feature title"
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>

            <FormField id="key" label="Key" error={errors.key}>
              {field => (
                <Input
                  {...field}
                  name="key"
                  placeholder="optional-unique-key"
                  onChange={e => setData('key', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="description"
              label="Description"
              error={errors.description}
            >
              {field => (
                <Textarea
                  {...field}
                  name="description"
                  rows={6}
                  placeholder="enter feature description"
                  onChange={e => setData('description', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="image_src"
              label="Image path"
              error={errors.image_src}
            >
              {field => (
                <Input
                  {...field}
                  name="image_src"
                  placeholder="/assets/example.webp"
                  onChange={e => setData('image_src', e.target.value)}
                />
              )}
            </FormField>

            <FormField id="link" label="Link" error={errors.link}>
              {field => (
                <Input
                  {...field}
                  name="link"
                  placeholder="/media-fellows"
                  onChange={e => setData('link', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="sort_order"
              label="Sort order"
              error={errors.sort_order}
            >
              {field => (
                <Input
                  {...field}
                  type="number"
                  name="sort_order"
                  onChange={e => setData('sort_order', Number(e.target.value))}
                />
              )}
            </FormField>

            <Field orientation="horizontal" className="items-center">
              <Switch
                checked={data.is_active}
                id="is_active"
                name="is_active"
                onCheckedChange={value => setData('is_active', value)}
              />
              <FieldLabel htmlFor="is_active">
                Visible on the home page
              </FieldLabel>
              <FieldError>{errors.is_active}</FieldError>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <PrimaryButton type="submit" isLoading={processing}>
              Create
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
