import { useForm } from '@inertiajs/react';

import InputError from '@/components/Backend/InputError';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function CreateSliderForm({
  open = undefined,
  setOpen = undefined,
  pages = undefined,
}: any) {
  const { setData, post, processing, errors, reset } = useForm({
    name: '',
    page_id: null,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.sliders.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Slider Created.',
          description: 'Slider Created Successfully',
        });
        setOpen(!open);
      },
      onError: errors => {
        if (errors.title) {
          // @ts-ignore allowlist-migration
          reset('title');
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slider</DialogTitle>
          <DialogDescription>Add new slider.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              name="name"
              placeholder="enter name of slider"
              onChange={e => setData('name', e.target.value)}
            />

            {errors.name && (
              <InputError className="mt-2">{errors.name}</InputError>
            )}
          </div>

          <div className="w-[280px]">
            <Label htmlFor="pages">Pages</Label>
            <Select
              // @ts-ignore allowlist-migration
              id="pages"
              name="pages"
              // @ts-ignore allowlist-migration
              onValueChange={value => setData('page_id', value)}
              placeholder="Select pages"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pages" />
              </SelectTrigger>

              <SelectContent className="w-[280px]">
                <SelectGroup>
                  <SelectLabel>Pages</SelectLabel>
                  {pages.map((page: any) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.page_id && (
              <InputError className="mt-2">{errors.page_id}</InputError>
            )}
          </div>
          <div className="space-x-2">
            <PrimaryButton type="submit" isLoading={processing}>
              Create
            </PrimaryButton>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
