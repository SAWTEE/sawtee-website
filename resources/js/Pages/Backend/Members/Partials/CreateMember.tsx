import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
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

export default function CreateMember({
  open = undefined,
  setOpen = undefined,
}: any) {
  const { setData, post, errors, reset } = useForm({
    country: '',
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.members.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Member Created.',
          description: 'Member Created Successfully',
        });
        reset('country');
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
          <DialogDescription>Create new member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                id="country"
                label="Country"
                error={errors.country}
                required
                className="col-span-4"
              >
                {field => (
                  <Input
                    {...field}
                    name="country"
                    className="col-span-3"
                    placeholder="enter member country"
                    onChange={e => setData('country', e.target.value)}
                  />
                )}
              </FormField>
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
