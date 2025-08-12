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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
export default function CreateMemberInstitute({ open, setOpen, members }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    link: '',
    logo_image_src: '',
    member_id: null,
  });
  const { toast } = useToast();

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
          <DialogDescription>Create new institute</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-right">
                Institute Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="enter institute name"
                onChange={e => setData('name', e.target.value)}
                required
              />

              {errors.name && (
                <InputError className="mt-2">{errors.name}</InputError>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="link" className="text-right">
                Institute link
              </Label>
              <Input
                id="link"
                name="link"
                className="col-span-3"
                placeholder="enter institute link"
                onChange={e => setData('link', e.target.value)}
                required
              />

              {errors.link && (
                <InputError className="mt-2">{errors.link}</InputError>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="logo_image_src" className="text-right">
                Logo Image Source
              </Label>
              <Input
                id="logo_image_src"
                name="logo_image_src"
                className="col-span-3"
                placeholder="enter institute logo_image_src"
                onChange={e => setData('logo_image_src', e.target.value)}
              />

              {errors.logo_image_src && (
                <InputError className="mt-2">
                  {errors.logo_image_src}
                </InputError>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-2">
              <Label htmlFor="member_id">Select Member Country</Label>
              <Select
                name="member_id"
                value={data.member_id}
                onValueChange={value => setData('member_id', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member country" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
