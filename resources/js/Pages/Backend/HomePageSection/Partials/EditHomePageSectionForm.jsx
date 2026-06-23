import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
export default function EditHomePageSectionForm({ section }) {
  const { data, setData, processing, errors, reset, patch } = useForm({
    name: section.name,
    description: section.description,
    order: section.order,
    show: section.show,
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();
    patch(route('admin.home-page-sections.update', section.id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Section edited.',
          description: 'Home page section edited successfully',
        }),
      onError: errors => {
        if (errors.name) {
          reset('name');
        }
      },
    });
  };

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={data.name}
            placeholder="enter section name"
            onChange={e => {
              setData('name', e.target.value);
            }}
          />

          {errors.name && (
            <InputError className="mt-2">{errors.name}</InputError>
          )}
        </div>
        <div className="col-span-1">
          <Label htmlFor="description">description</Label>
          <Textarea
            id="description"
            name="description"
            value={data.description ?? ''}
            onChange={e => setData('description', e.target.value)}
            mt={1}
          />
          {errors.description && (
            <InputError className="mt-2">{errors.description}</InputError>
          )}
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input
            type="number"
            id="order"
            name="order"
            value={data.order}
            onChange={e => {
              setData('order', e.target.value);
            }}
          />
        </div>
        <div className="col-span-1 flex items-center space-x-2">
          <Switch
            checked={data.show}
            className="data-[state=checked]:bg-green-500"
            id="show"
            name="show"
            onCheckedChange={value => setData('show', value)}
          />
          <Label htmlFor="show"> Section Visible</Label>

          {errors.show && (
            <InputError className="mt-2">{errors.show}</InputError>
          )}
        </div>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
