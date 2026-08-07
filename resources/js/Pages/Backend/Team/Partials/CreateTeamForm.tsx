import { useForm } from '@inertiajs/react';
import React from 'react';

import DropZone from '@/components/Backend/DropZone';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function CreateTeamForm() {
  const { data, setData, post, processing, errors, reset, progress } = useForm({
    name: '',
    email: '',
    designation: null,
    bio: '',
    order: 0,
    image: '',
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(null);

  function setDataImage(image: any) {
    if (image) {
      const reader = new FileReader();
      reader.onload = e => {
        // @ts-ignore allowlist-migration
        setImage(e.target.result);
      };
      reader.readAsDataURL(image);
      setData('image', image);
    } else {
      setImage(null);
      // @ts-ignore allowlist-migration
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(route('admin.teams.store'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          position: 'top-right',
          title: 'Team member Created.',
          description: 'Team member Created Successfully',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
        reset();
        setImage(null);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          id="name"
          label="Name"
          error={errors.name}
          required
          className="col-span-3"
        >
          {field => (
            <Input
              {...field}
              name="name"
              placeholder="enter member name"
              onChange={e => setData('name', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="email"
          label="email"
          error={errors.email}
          className="col-span-1"
        >
          {field => (
            <Input
              {...field}
              type="email"
              name="email"
              placeholder="enter member email"
              onChange={e => setData('email', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="designation"
          label="Designation"
          error={errors.designation}
          className="col-span-2"
        >
          {field => (
            <Input
              {...field}
              name="designation"
              placeholder="enter member designation"
              // @ts-ignore allowlist-migration
              onChange={e => setData('designation', e.target.value)}
            />
          )}
        </FormField>
        <FormField
          id="order"
          label="Order"
          error={errors.order}
          className="col-span-1"
        >
          {field => (
            <Input
              {...field}
              type="number"
              name="order"
              defaultValue={data.order}
              // @ts-ignore allowlist-migration
              onChange={e => setData('order', e.target.value)}
            />
          )}
        </FormField>
        <FormField
          id="bio"
          label="Bio"
          error={errors.bio}
          className="col-span-2"
        >
          {field => (
            <Textarea
              {...field}
              name="bio"
              placeholder="enter member bio"
              rows={8}
              onChange={e => setData('bio', e.target.value)}
            />
          )}
        </FormField>

        <Field
          data-invalid={errors.image || undefined}
          className="col-span-2 gap-2"
        >
          <FieldLabel htmlFor="image">Image</FieldLabel>
          <DropZone
            id="image"
            name="image"
            defaultValue={image}
            onValueChange={setDataImage}
            error={errors.image}
            progress={progress}
            uploading={processing}
          />
        </Field>
        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
