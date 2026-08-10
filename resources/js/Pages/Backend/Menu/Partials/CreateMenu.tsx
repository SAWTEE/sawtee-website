import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateMenu({
  open = undefined,
  setOpen = undefined,
}: any) {
  const { setData, post, processing, errors, reset } = useForm({
    title: '',
    location: '',
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.create.menu'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu Created.',
          description: 'Menu Created Successfully',
        });
        reset();
        setOpen(!open);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Menu</DialogTitle>
          <DialogDescription>Add new menu.</DialogDescription>
        </DialogHeader>
        <DialogClose />
        <form onSubmit={submit} noValidate>
          <div className="space-y-4">
            <FormField
              id="title"
              label="Menu Name"
              error={errors.title}
              required
            >
              {field => (
                <Input
                  {...field}
                  name="title"
                  placeholder="enter menu title"
                  autoFocus
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="location"
              label="Menu Location"
              error={errors.location}
              required
            >
              {field => (
                <Input
                  {...field}
                  name="location"
                  placeholder="enter menu location"
                  onChange={e => setData('location', e.target.value)}
                />
              )}
            </FormField>
            <DialogFooter>
              <PrimaryButton type="submit" isLoading={processing}>
                Add
              </PrimaryButton>
              <Button variant="outline" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
