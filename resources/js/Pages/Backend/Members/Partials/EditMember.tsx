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

export default function EditCategoryForm({
  open = undefined,
  setOpen = undefined,
  member = undefined,
}: any) {
  const { data, setData, post, processing, errors } = useForm({
    country: member.country,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.members.update', {
        _method: 'patch',
        member: member.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Member edited.',
            description: 'Member edited Successfully',
          });
          setOpen(!open);
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit member</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                id="country"
                label="country"
                error={errors.country}
                required
                className="col-span-4"
              >
                {field => (
                  <Input
                    {...field}
                    name="memebr"
                    className="col-span-3"
                    value={data.country}
                    placeholder="enter category name"
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
