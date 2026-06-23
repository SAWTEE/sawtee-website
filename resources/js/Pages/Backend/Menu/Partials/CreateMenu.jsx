import InputError from '@/components/Backend/InputError';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

export default function CreateMenu({ open, setOpen }) {
  const { setData, post, processing, errors, reset } = useForm({
    title: '',
    location: '',
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    post(route('admin.create.menu'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu Created.',
          description: 'Menu Created Successfully',
        });
        setOpen(!open);
      },
      onError: errors => {
        console.error(errors);
        if (errors.title) {
          reset('title');
        }
        if (errors.location) {
          reset('location');
        }
      },
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
        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Menu Name</Label>

              <Input
                id="title"
                name="title"
                placeholder="enter menu title"
                autoFocus
                onChange={e => setData('title', e.target.value)}
                required
              />

              {errors.title && (
                <InputError className="mt-2">{errors.title}</InputError>
              )}
            </div>

            <div>
              <Label htmlFor="location">Menu Location</Label>

              <Input
                id="location"
                name="location"
                placeholder="enter menu location"
                onChange={e => setData('location', e.target.value)}
                required
              />

              {errors.location && (
                <InputError className="mt-2">{errors.location}</InputError>
              )}
            </div>
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
