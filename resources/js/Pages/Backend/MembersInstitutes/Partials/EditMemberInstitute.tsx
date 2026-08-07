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

export default function EditMemberInstitute({
  open = undefined,
  setOpen = undefined,
  institute = undefined,
  members = undefined,
}: any) {
  const { data, setData, post, errors } = useForm({
    name: institute.name,
    link: institute.link,
    logo_image_src: institute.logo_image_src,
    member_id: institute.member_id,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.institutes.update', {
        _method: 'patch',
        institute: institute.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Institute edited.',
            description: 'Institute edited Successfully',
          });
          setOpen(!open);
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit institute</DialogDescription>
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
                  value={data.name}
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
                  value={data.link}
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
                  value={data.logo_image_src}
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
                  value={data.member_id}
                  onValueChange={value => setData('member_id', value)}
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(!open)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
