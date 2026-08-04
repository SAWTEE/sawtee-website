import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

import { useForm } from '@inertiajs/react';
import React from 'react';

export default function CreateTeamForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    designation: null,
    bio: '',
    order: 0,
    image: '',
  });
  const { toast } = useToast();
  const [image, setImage] = React.useState(null);

  function setDataImage(image) {
    if (image) {
      const reader = new FileReader();
      reader.onload = e => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(image);
      setData('image', image);
    } else {
      setImage(null);
      setData('image', null);
    }
  }

  const submit = e => {
    e.preventDefault();
    post(route('admin.teams.store'), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          position: 'top-right',
          title: 'Team member Created.',
          description: 'Team member Created Successfully',
          status: 'success',
          duration: 6000,
          isClosable: true,
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
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            placeholder="enter member name"
            onChange={e => setData('name', e.target.value)}
            required
          />

          {errors.name && <InputError mt={2}>{errors.name}</InputError>}
        </div>

        <div className="col-span-1">
          <Label htmlFor="email">email</Label>

          <Input
            type="email"
            id="email"
            name="email"
            placeholder="enter member email"
            onChange={e => setData('email', e.target.value)}
          />

          {errors.email && <InputError>{errors.email}</InputError>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            placeholder="enter member designation"
            onChange={e => setData('designation', e.target.value)}
          />
          {errors.designation && (
            <InputError mt={2}>{errors.designation}</InputError>
          )}
        </div>
        <div className="col-span-1">
          <Label htmlFor="order">Order</Label>
          <Input
            type="number"
            id="order"
            name="order"
            defaultValue={data.order}
            onChange={e => setData('order', e.target.value)}
          />
          {errors.order && <InputError mt={2}>{errors.order}</InputError>}
        </div>
        <div className="col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="enter member bio"
            rows={8}
            onChange={e => setData('bio', e.target.value)}
          />
          {errors.bio && <InputError mt={2}>{errors.bio}</InputError>}
        </div>

        <div className="col-span-2">
          <DropZone
            id="image"
            name="image"
            accept="image/.png,.jpg,.jpeg,.webp"
            defaultValue={image}
            onValueChange={setDataImage}
          />

          {errors.image && <InputError mt={2}>{errors.image}</InputError>}
        </div>
        <PrimaryButton type="submit" isLoading={processing}>
          Save
        </PrimaryButton>
      </div>
    </form>
  );
}
