import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditHomePageSectionForm({ section = undefined }: any) {
  const { data, setData, processing, errors, patch } = useForm({
    name: section.name,
    description: section.description,
    order: section.order,
    show: section.show,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    patch(route('admin.home-page-sections.update', section.id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Section edited.',
          description: 'Home page section edited successfully',
        }),
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="name"
          label="Name"
          error={errors.name}
          className="col-span-1"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="name"
              value={data.name}
              placeholder="enter section name"
              onChange={e => {
                setData('name', e.target.value);
              }}
            />
          )}
        </FormField>
        <FormField
          id="description"
          label="description"
          error={errors.description}
          className="col-span-1"
        >
          {field => (
            <Textarea
              {...field}
              name="description"
              value={data.description ?? ''}
              onChange={e => setData('description', e.target.value)}
              // @ts-ignore allowlist-migration
              mt={1}
            />
          )}
        </FormField>
        <FormField id="order" label="Order" error={errors.order}>
          {field => (
            <Input
              {...field}
              type="number"
              name="order"
              value={data.order}
              onChange={e => {
                setData('order', e.target.value);
              }}
            />
          )}
        </FormField>
        <Field
          data-invalid={errors.show || undefined}
          orientation="horizontal"
          className="col-span-1 items-center"
        >
          <Switch
            checked={data.show}
            className="data-[state=checked]:bg-green-500"
            id="show"
            name="show"
            onCheckedChange={value => setData('show', value)}
          />
          <FieldLabel htmlFor="show"> Section Visible</FieldLabel>
          <FieldError>{errors.show}</FieldError>
        </Field>

        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
