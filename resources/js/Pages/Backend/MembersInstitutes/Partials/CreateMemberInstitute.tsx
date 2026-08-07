import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateMemberInstitute({
  open = undefined,
  setOpen = undefined,
  members = undefined,
}: any) {
  const { data, setData, post, errors, reset } = useForm({
    name: '',
    link: '',
    logo_image_src: '',
    member_id: null,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(route('admin.institutes.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Institute Created.',
          description: 'Institute Created Successfully',
        });
        reset('name', 'link', 'logo_image_src');
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
          <DialogDescription>Create new institute</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid grid-cols-4 items-center gap-4">
            <FormField
              id="name"
              label="Institute Name"
              error={errors.name}
              required
              className="col-span-2"
            >
              {field => (
                <Input
                  {...field}
                  name="name"
                  placeholder="enter institute name"
                  onChange={e => setData('name', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="link"
              label="Institute link"
              error={errors.link}
              required
              className="col-span-2"
            >
              {field => (
                <Input
                  {...field}
                  name="link"
                  className="col-span-3"
                  placeholder="enter institute link"
                  onChange={e => setData('link', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="logo_image_src"
              label="Logo Image Source"
              error={errors.logo_image_src}
              className="col-span-2"
            >
              {field => (
                <Input
                  {...field}
                  name="logo_image_src"
                  className="col-span-3"
                  placeholder="enter institute logo_image_src"
                  onChange={e => setData('logo_image_src', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="member_id"
              label="Select Member Country"
              error={errors.member_id}
              className="col-span-2"
            >
              {field => (
                <Select
                  name="member_id"
                  // @ts-ignore allowlist-migration
                  value={data.member_id}
                  // @ts-ignore allowlist-migration
                  onValueChange={value => setData('member_id', Number(value))}
                >
                  <SelectTrigger
                    id={field.id}
                    aria-invalid={field['aria-invalid']}
                    aria-describedby={field['aria-describedby']}
                  >
                    <SelectValue placeholder="Select member country" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
