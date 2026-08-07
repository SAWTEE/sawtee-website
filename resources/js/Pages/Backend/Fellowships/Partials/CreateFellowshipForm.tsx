import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import YearPicker from '@/components/Backend/YearPicker';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateFellowshipForm({
  open = undefined,
  setOpen = undefined,
}: any) {
  const { data, setData, post, errors, reset } = useForm({
    title: '',
    description: '',
    year: '',
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
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
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create new Fellowship.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                id="title"
                label="Title"
                error={errors.title}
                required
                className="col-span-2"
              >
                {field => (
                  <Input
                    {...field}
                    name="title"
                    placeholder="enter category name"
                    onChange={e => setData('title', e.target.value)}
                  />
                )}
              </FormField>
              <FormField
                id="year"
                label="Year"
                error={errors.year}
                required
                className="col-span-2"
              >
                {field => (
                  <YearPicker
                    {...field}
                    value={data.year}
                    placeholder="Select year"
                    fromYear={2023}
                    toYear={new Date().getFullYear() + 1}
                    onChange={year => setData('year', (year ?? '') as any)}
                  />
                )}
              </FormField>
              <FormField
                id="description"
                label=" Description"
                error={errors.description}
                className="col-span-4"
              >
                {field => (
                  <Textarea
                    {...field}
                    name="description"
                    className="mt-1 block"
                    placeholder="enter description"
                    rows={8}
                    onChange={e => setData('description', e.target.value)}
                  />
                )}
              </FormField>
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
