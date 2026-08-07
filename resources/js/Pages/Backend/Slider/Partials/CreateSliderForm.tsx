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
import { toastFormErrors } from '@/lib/form-errors';

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
        reset();
        setOpen(!open);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slider</DialogTitle>
          <DialogDescription>Add new slider.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-4">
          <FormField id="name" label="Name" error={errors.name}>
            {field => (
              <Input
                {...field}
                name="name"
                placeholder="enter name of slider"
                onChange={e => setData('name', e.target.value)}
              />
            )}
          </FormField>

          <FormField
            id="page_id"
            label="Pages"
            error={errors.page_id}
            className="w-[280px]"
          >
            {field => (
              <Select
                name="pages"
                // @ts-ignore allowlist-migration
                onValueChange={value => setData('page_id', value)}
              >
                <SelectTrigger
                  id={field.id}
                  aria-invalid={field['aria-invalid']}
                  aria-describedby={field['aria-describedby']}
                >
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
            )}
          </FormField>
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
