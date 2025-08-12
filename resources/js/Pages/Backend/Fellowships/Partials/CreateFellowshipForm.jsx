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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
export default function CreateFellowshipForm({ open, setOpen }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    year: '',
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    post(route('admin.fellowships.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Fellowship Created.',
          description: 'Fellowship Created Successfully',
        });
        reset('title', 'description', 'year');
        setOpen(false);
      },
      onError: errors => {
        for (const key in errors) {
          if (Object.hasOwnProperty.call(errors, key)) {
            const value = errors[key];
            reset(key);
            return toast({
              title: 'Uh oh, Something went wrong',
              description: `${key.toUpperCase()} field error` + `: ${value}`,
            });
          }
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create new Fellowship.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="enter category name"
                  onChange={e => setData('title', e.target.value)}
                  required
                />

                {errors.title && (
                  <InputError className="mt-2">{errors.title}</InputError>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  name="year"
                  placeholder="enter year"
                  onChange={e => setData('year', Number(e.target.value))}
                />
                {errors.year && (
                  <InputError className="mt-2">{errors.year}</InputError>
                )}
              </div>
              <div className="col-span-4">
                <Label htmlFor="description"> Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="mt-1 block"
                  placeholder="enter description"
                  rows={8}
                  onChange={e => setData('description', e.target.value)}
                />
                {errors.description && (
                  <InputError className="mt-2">{errors.description}</InputError>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
