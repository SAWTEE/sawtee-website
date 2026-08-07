import { useForm } from '@inertiajs/react';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

import CreateSlideForm from '../../Slide/CreateSlideForm';
import Slides from '../../Slide/Slides';

export default function EditSliderForm({
  slider = undefined,
  slides = undefined,
  pages = undefined,
}: any) {
  const { data, setData, post, processing, errors } = useForm({
    name: slider.name,
    page_id: slider.page_id,
  });
  const { toast } = useToast();
  const [createSlide, setCreateSlide] = useState(false);

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();
    post(
      route('admin.sliders.update', {
        _method: 'patch',
        slider: slider.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Slider edited.',
            description: 'Slider changes saved Successfully',
          });
        },
        onError: errors => toastFormErrors(errors, toast),
      }
    );
  };
  return (
    <>
      {slides.length < 1 && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>No Slides</AlertTitle>
          <AlertDescription>No slides added yet.</AlertDescription>
        </Alert>
      )}
      <div className="grid items-end gap-4 lg:grid-cols-5">
        <form onSubmit={submit} noValidate className="col-span-4">
          <div className="grid w-full grid-cols-1 items-end gap-6 lg:grid-cols-4">
            <FormField
              id="name"
              label="Name"
              error={errors.name}
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
              id="page_id"
              label="Page"
              error={errors.page_id}
              className="col-span-1"
            >
              {field => (
                <Select
                  name="pages"
                  value={data.page_id}
                  onValueChange={value => setData('page_id', value)}
                >
                  <SelectTrigger
                    id={field.id}
                    aria-invalid={field['aria-invalid']}
                    aria-describedby={field['aria-describedby']}
                  >
                    <SelectValue placeholder="Select pages" />
                  </SelectTrigger>
                  <SelectContent className="w-[280px]">
                    <SelectGroup>
                      <SelectLabel>Pages</SelectLabel>

                      {pages.map((page: any) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <PrimaryButton type="submit" disabled={processing}>
              Save slider
            </PrimaryButton>
          </div>
        </form>
        <Button
          variant="outline"
          className="inline-flex"
          onClick={() => setCreateSlide(!createSlide)}
        >
          Add slide
          <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {createSlide && (
        <CreateSlideForm
          open={createSlide}
          setOpen={setCreateSlide}
          slider={slider}
        />
      )}
      {slides.length > 0 && <Slides slides={slides} slider={slider} />}
    </>
  );
}
