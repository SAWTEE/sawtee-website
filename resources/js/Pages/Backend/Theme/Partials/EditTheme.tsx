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

export default function EditTheme({ theme, open, setOpen }) {
  const { data, setData, post, errors, reset } = useForm({
    title: theme.title,
    description: theme.description,
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    post(
      route('admin.themes.update', {
        _method: 'patch',
        theme: theme,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Theme edited.',
            description: 'Theme edited Successfully',
          });
          reset('title', 'description');
          setOpen(!open);
        },
        onError: errors => {
          if (errors.title) {
            reset('title');
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit theme</DialogTitle>
          <DialogDescription>{`Edit theme: ${theme.title}.`}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Label htmlFor="title">Title</Label>

                <Input
                  name="title"
                  placeholder="enter theme name"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  required
                />

                <InputError className="mt-2">{errors.title}</InputError>
              </div>

              <div className="col-span-4">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  name="description"
                  rows={6}
                  value={data.description}
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
            <PrimaryButton type="submit">Save</PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
