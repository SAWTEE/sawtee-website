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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateTheme({
  open = undefined,
  setOpen = undefined,
}: any) {
  const { setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
  });

  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.themes.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Theme Created.',
          description: 'New theme added successfully',
        });
        reset('title', 'description');
        setOpen(false);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create theme</DialogTitle>
          <DialogDescription>Add new theme.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                id="title"
                label="Title"
                error={errors.title}
                required
                className="col-span-4"
              >
                {field => (
                  <Input
                    {...field}
                    name="title"
                    placeholder="enter theme name"
                    onChange={e => setData('title', e.target.value)}
                  />
                )}
              </FormField>

              <FormField
                id="description"
                label="Description"
                error={errors.description}
                className="col-span-4"
              >
                {field => (
                  <Textarea
                    {...field}
                    name="description"
                    rows={10}
                    placeholder="enter theme description"
                    onChange={e => setData('description', e.target.value)}
                  />
                )}
              </FormField>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <PrimaryButton
              type="submit"
              isLoading={processing}
              //   disabled={processing}
            >
              Create
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
