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

export default function CreateTag({ open, setOpen }) {
  const { setData, post, processing, errors, reset } = useForm({
    name: '',
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();
    post(route('admin.tags.store'), {
      onSuccess: () => {
        toast({
          title: 'Tag Created.',
          description: 'Tag Created Successfully',
        });
        setOpen(!open);
      },
      onError: errors => {
        if (errors.name) {
          reset('name');
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
          <DialogDescription>Add new tag.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="flex items-end gap-2">
            <div className="w-2/3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
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
              <PrimaryButton
                type="submit"
                isLoading={processing}
                //   disabled={processing}
              >
                Create
              </PrimaryButton>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
