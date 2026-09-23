import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateHomePageSectionForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    heading: '',
    intro: '',
    description: '',
    order: '',
    show: true,
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.home-page-sections.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Section Created.',
          description: 'Home Page Section Created Successfully',
        });
        reset();
      },
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
              placeholder="enter section name"
              onChange={e => {
                setData('name', e.target.value);
              }}
            />
          )}
        </FormField>
        <FormField
          id="heading"
          label="Public heading"
          error={errors.heading}
          className="col-span-1"
        >
          {field => (
            <Input
              {...field}
              type="text"
              name="heading"
              placeholder="heading shown on the home page"
              onChange={e => {
                setData('heading', e.target.value);
              }}
            />
          )}
        </FormField>
        <FormField
          id="intro"
          label="Intro"
          error={errors.intro}
          className="col-span-2"
        >
          {field => (
            <Textarea
              {...field}
              name="intro"
              placeholder="optional intro shown under the heading"
              onChange={e => setData('intro', e.target.value)}
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
            // @ts-ignore allowlist-migration
            value={data.show}
            id="show"
            name="show"
            // @ts-ignore allowlist-migration
            onChange={e => setData('show', e.target.value)}
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
