import InputError from '@/components/Backend/InputError';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

export default function EditCategoryForm({
  open,
  setOpen,
  member,
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    country: member.country,
  });
  const { toast } = useToast();

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
          <DialogDescription>Edit member</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Label htmlFor="country" className="text-right">
                  country
                </Label>
                <Input
                  id="country"
                  name="memebr"
                  className="col-span-3"
                  value={data.country}
                  placeholder="enter category name"
                  onChange={e => setData('country', e.target.value)}
                  required
                />

                {errors.country && (
                  <InputError className="mt-2">{errors.country}</InputError>
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
