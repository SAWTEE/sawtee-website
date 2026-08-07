import { useForm } from '@inertiajs/react';
import { useState } from 'react';

import ContentEditor from '@/components/Backend/ContentEditor';
import DropZone from '@/components/Backend/DropZone';
import FormField from '@/components/Backend/FormField';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditFellow({
  fellow = undefined,
  fellowships = undefined,
}: any) {
  const { data, setData, post, errors, progress, processing } = useForm({
    name: fellow.name,
    fellowship_id: fellow.fellowship_id,
    designation: fellow.designation,
    description: fellow.description,
    experience: fellow.experience,
    image: fellow.media?.filter(
      // @ts-ignore allowlist-migration
      m => m.collection_name === 'profile_picture'
    )[0],
  });
  const { toast } = useToast();
  const [image, setImage] = useState(
    data.image ? data.image.preview_url : null
  );

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
      setData('image', null);
    }
  }

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    post(
      route('admin.fellows.update', {
        _method: 'patch',
        fellow: fellow,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Fellow Updated.',
            description: 'Fellow Updated Successfully',
          });
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-4 items-center gap-4">
        <FormField
          id="name"
          label="Name"
          error={errors.name}
          required
          className="col-span-2"
        >
          {field => (
            <Input
              {...field}
              name="name"
              className="col-span-3"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
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
              className="mt-1"
              value={data.designation}
              onChange={e => setData('designation', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="description"
          label="Description"
          error={errors.description}
          className="col-span-2"
        >
          {field => (
            <Textarea
              {...field}
              name="description"
              className="mt-1 block"
              value={data.description}
              rows={8}
              onChange={e => setData('description', e.target.value)}
            />
          )}
        </FormField>
        <FormField
          id="fellowship_id"
          label="Select Fellowship Year"
          error={errors.fellowship_id}
          className="col-span-1"
        >
          {field => (
            <Select
              name="fellowship_id"
              value={data.fellowship_id ?? ''}
              onValueChange={value => setData('fellowship_id', Number(value))}
            >
              <SelectTrigger
                id={field.id}
                aria-invalid={field['aria-invalid']}
                aria-describedby={field['aria-describedby']}
              >
                <SelectValue placeholder="Select fellowship year" />
              </SelectTrigger>
              <SelectContent>
                {fellowships.map((fellowship: any) => (
                  <SelectItem key={fellowship.id} value={fellowship.id}>
                    {fellowship.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <Field
          data-invalid={errors.image || undefined}
          className="col-span-1 gap-2"
        >
          <FieldLabel htmlFor="image"> Image</FieldLabel>
          <DropZone
            htmlFor={'image'}
            onValueChange={setDataImage}
            defaultValue={image}
            error={errors.image}
            progress={progress}
            uploading={processing}
          />
        </Field>
        <Field
          data-invalid={errors.experience || undefined}
          className="col-span-4 gap-2"
        >
          <FieldLabel htmlFor="experience">Experience</FieldLabel>
          <ContentEditor
            // type="classic"
            name="experience"
            initialValue={data.experience}
            id="experience"
            onChange={(evt: any, editor: any) =>
              setData('experience', editor.getContent())
            }
          />
          <FieldError>{errors.experience}</FieldError>
        </Field>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
