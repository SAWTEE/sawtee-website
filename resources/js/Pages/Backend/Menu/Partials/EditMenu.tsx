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

export default function EditMenuForm({ open, setOpen, menu }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: menu.title,
    location: menu.location,
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    post(
      route('admin.update.menu', {
        _method: 'patch',
        menu: menu,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Menu edited.',
            description: 'Menu edited Successfully',
          });
          setOpen(!open);
        },
        onError: errors => {
          if (errors.title) {
            reset('title');
          }
          if (errors.location) {
            reset('location');
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>Manage menu</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                autoFocus
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />

              {errors.title && (
                <InputError className="mt-2">{errors.title}</InputError>
              )}
            </div>

            <div>
              <Label htmlFor="location">location</Label>

              <Input
                id="location"
                name="location"
                value={data.location}
                onChange={e => setData('location', e.target.value)}
              />

              {errors.location && (
                <InputError className="mt-2">{errors.location}</InputError>
              )}
            </div>
            <DialogFooter>
              <PrimaryButton type="submit" isLoading={processing}>
                Save
              </PrimaryButton>
              <Button variant="ghost" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
