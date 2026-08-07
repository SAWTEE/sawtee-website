import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditTag({
  tag = undefined,
  open = undefined,
  setOpen = undefined,
}: any) {
  const { data, setData, post, processing, errors } = useForm({
    name: tag.name,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(
      route('admin.tags.update', {
        _method: 'patch',
        tag: tag,
      }),
      {
        onSuccess: () => {
          toast({
            title: 'Tag edited.',
            description: 'Tag edited Successfully',
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
          <DialogTitle>Edit tag</DialogTitle>
          <DialogDescription>{`Edit tag: ${tag.name}`}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate>
          <div className="flex items-end gap-2">
            <FormField
              id="name"
              label="Name"
              error={errors.name}
              required
              className="w-2/3"
            >
              {field => (
                <Input
                  {...field}
                  name="name"
                  value={data.name}
                  placeholder="enter tag name"
                  onChange={e => setData('name', e.target.value)}
                />
              )}
            </FormField>
            <div className="flex w-1/3 gap-2">
              <Button variant="outline" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
