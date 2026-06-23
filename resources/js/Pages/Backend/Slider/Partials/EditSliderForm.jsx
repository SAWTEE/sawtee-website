import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import CreateSlideForm from '../../Slide/CreateSlideForm';
import Slides from '../../Slide/Slides';
import { useState } from 'react';

export default function EditSliderForm({ slider, slides, pages }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: slider.name,
    page_id: slider.page_id,
  });
  const { toast } = useToast();
  const [createSlide, setCreateSlide] = useState(false);

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
        onError: errors => {
          console.error(errors);
          if (errors.title) {
            reset('title');
          }
        },
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
        <form onSubmit={submit} className="col-span-4">
          <div className="grid w-full grid-cols-1 items-end gap-6 lg:grid-cols-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && (
                <InputError className="mt-2">{errors.name}</InputError>
              )}
            </div>
            <div className="col-span-1">
              <Label htmlFor="pages">Page</Label>
              <Select
                id="pages"
                name="pages"
                value={data.page_id}
                placeholder="Select pages"
                onValueChange={value => setData('page_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pages" />
                </SelectTrigger>
                <SelectContent className="w-[280px]">
                  <SelectGroup>
                    <SelectLabel>Pages</SelectLabel>

                    {pages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.page_id && (
                <InputError className="mt-2">{errors.page_id}</InputError>
              )}
            </div>
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
