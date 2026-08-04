import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useForm } from '@inertiajs/react';

export default function EditTag({ tag, open, setOpen }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: tag.name,
  });
  const { toast } = useToast();

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
          reset('name');
          setOpen(!open);
        },
        onError: errors => {
          if (errors.name) {
            reset('name');
            console.error(errors);
          }
        },
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

        <form onSubmit={submit}>
          <div className="flex items-end gap-2">
            <div className="w-2/3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                placeholder="enter tag name"
                onChange={e => setData('name', e.target.value)}
                required
              />

              {errors.name && (
                <InputError className="mt-2">{errors.name}</InputError>
              )}
            </div>
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
