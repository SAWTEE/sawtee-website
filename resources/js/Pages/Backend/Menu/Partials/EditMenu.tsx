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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditMenuForm({
  open = undefined,
  setOpen = undefined,
  menu = undefined,
}: any) {
  const { data, setData, post, processing, errors } = useForm({
    title: menu.title,
    location: menu.location,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(
      route('admin.update.menu', {
        _method: 'patch',
        menu: menu,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Menu edited.',
            description: 'Menu edited Successfully',
          });
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
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>Manage menu</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="space-y-4">
            <FormField id="title" label="Title" error={errors.title}>
              {field => (
                <Input
                  {...field}
                  name="title"
                  autoFocus
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>

            <FormField id="location" label="location" error={errors.location}>
              {field => (
                <Input
                  {...field}
                  name="location"
                  value={data.location}
                  onChange={e => setData('location', e.target.value)}
                />
              )}
            </FormField>
            <DialogFooter>
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
              <Button variant="ghost" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
