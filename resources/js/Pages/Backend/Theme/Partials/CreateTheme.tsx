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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
export default function CreateTheme({ open, setOpen }) {
  const { setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
  });

  const { toast } = useToast();

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
      onError: errors => {
        errors.title && reset('title');
        errors.description && reset('description');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create theme</DialogTitle>
          <DialogDescription>Add new theme.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Label htmlFor="title">Title</Label>

                <Input
                  name="title"
                  placeholder="enter theme name"
                  onChange={e => setData('title', e.target.value)}
                  required
                />

                <InputError className="mt-2">{errors.title}</InputError>
              </div>

              <div className="col-span-4">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  name="description"
                  rows={10}
                  placeholder="enter theme description"
                  onChange={e => setData('description', e.target.value)}
                />

                <InputError className="mt-2">{errors.description}</InputError>
              </div>
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
