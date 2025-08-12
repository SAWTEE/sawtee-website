import DropZone from '@/components/Backend/DropZone';
import InputError from '@/components/Backend/InputError';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ContentEditor from '@/components/Backend/ContentEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

export default function EditFellow({ fellow, fellowships }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: fellow.name,
    fellowship_id: fellow.fellowship_id,
    designation: fellow.designation,
    description: fellow.description,
    experience: fellow.experience,
    image: fellow.media?.filter(
      m => m.collection_name === 'profile_picture'
    )[0],
  });
  const { toast } = useToast();
  const [image, setImage] = useState(
    data.image ? data.image.preview_url : null
  );

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

    post(route('admin.fellows.update', {
      _method: 'patch',
      fellow: fellow,
    }), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Fellow Created.',
          description: 'Fellow Created Successfully',
        });
        reset();
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
    <form onSubmit={submit}>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-2">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            className="col-span-3"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            required
          />

          {errors.name && (
            <InputError className="mt-2">{errors.name}</InputError>
          )}
        </div>
        <div className="col-span-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            className="mt-1"
            value={data.designation}
            onChange={e => setData('designation', e.target.value)}
          />

          <InputError className="mt-2">{errors.designation}</InputError>
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            className="mt-1 block"
            value={data.description}
            rows={8}
            onChange={e => setData('description', e.target.value)}
          />
          <InputError className="mt-2">{errors.description}</InputError>
        </div>
        <div className="col-span-1">
          <Label htmlFor="fellowship_id">Select Fellowship Year</Label>
          <Select
            name="fellowship_id"
            id="fellowship_id"
            value={data.fellowship_id ?? ''}
            onValueChange={value => setData('fellowship_id', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fellowship year" />
            </SelectTrigger>
            <SelectContent>
              {fellowships.map(fellowship => (
                <SelectItem key={fellowship.id} value={fellowship.id}>
                  {fellowship.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <Label htmlFor="image"> Image</Label>

          <DropZone
            htmlFor={'image'}
            onValueChange={setDataImage}
            defaultValue={image}
            //   className="h-64"
          />

          {errors.image && (
            <InputError className="mt-2">{errors.image}</InputError>
          )}
        </div>
        <div className="col-span-4">
          <Label htmlFor="experience">Experience</Label>

          <ContentEditor
            // type="classic"
            name="experience"
            initialValue={data.experience}
            id="experience"
            onChange={(evt, editor) =>
              setData('experience', editor.getContent())
            }
          />

          {errors.experience && (
            <InputError className={'mt-2'}>{errors.experience}</InputError>
          )}
        </div>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
