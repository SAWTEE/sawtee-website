import InputError from '@/components/Backend/InputError';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function CreateResearchForm({ research }) {
  const { data, setData, post, processing, errors } = useForm({
    title: research.title,
    subtitle: research.subtitle,
    description: research.description,
    year: research.year,
    image: research.featured_image ? research.featured_image.name : null,
    file: research.media[0] ? research.media[0].original_url : null,
    meta_title: research.meta_title,
    meta_description: research.meta_description,
  });
  const toast = useToast();
  const [image, setImage] = useState(data.image);
  const [filename, setFilename] = useState(
    research.file ? research.file.name : ''
  );

  const submit = e => {
    e.preventDefault();
    post(
      route('admin.research.update', {
        _method: 'patch',
        research: research.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () =>
          toast({
            position: 'top-right',
            title: 'Research Edited.',
            description: `Research ${data.title} Successfully`,
            status: 'success',
            duration: 6000,
            isClosable: true,
          }),
        onError: errors => {
          console.error(errors);
        },
      }
    );
  };

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-col gap-8 col-span-12 self-center md:col-span-8 px-4">
          <div className="mx-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="enter research title"
              className="mt-1"
              value={data.title}
              autoComplete="title"
              onChange={e => setData('title', e.target.value)}
            />

            {errors.title && (
              <InputError className="mt-2">{errors.title}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Label htmlFor="subtitle">Subtitle</Label>

            <Input
              type="text"
              id="subtitle"
              name="subtitle"
              className="mt-1"
              value={data.subtitle}
              placeholder="enter research subtitle"
              autoComplete="subtitle"
              onChange={e => setData('subtitle', e.target.value)}
            />

            {errors.title && (
              <InputError className={'mt-2'}>{errors.title}</InputError>
            )}
          </div>
          <div className="mx-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              rows={6}
              className="mt-1"
              value={data.description}
              resize={'vertical'}
              placeholder="Describe your research here."
              onChange={e => setData('description', e.target.value)}
            />

            {errors.description && (
              <InputError className={'mt-2'}>{errors.description}</InputError>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 self-center col-span-12 px-3 md:col-span-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex gap-2">
                  SEO Meta Tags
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add meta-title and meta-description for SEO</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col justify-start gap-4">
                  <div className="mx-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      className="mt-1"
                      value={data.meta_title}
                      placeholder="enter meta title"
                      onChange={e => setData('meta_title', e.target.value)}
                    />

                    <InputError className="mt-2">
                      {errors.meta_title}
                    </InputError>
                  </div>

                  <div className="mx-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      value={data.meta_description}
                      className="block mt-1"
                      placeholder="enter meta_description"
                      rows={3}
                      onChange={e =>
                        setData('meta_description', e.target.value)
                      }
                    />
                    <InputError className="mt-2">
                      {errors.meta_description}
                    </InputError>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <fieldset className="mx-2">
            <Label as="legend" htmlFor="year">
              Year
            </Label>

            <Input
              name="year"
              id="year"
              className="mt-1"
              value={data.year}
              onChange={e => setData('year', Number(e.target.value))}
            />
            {errors.year && (
              <InputError className={'mt-2'}>{errors.year}</InputError>
            )}
          </fieldset>

          <div className="mx-2">
            <Label htmlFor="file">File Upload</Label>

            <Input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              id="file"
              name="file"
              className="mt-1"
              onChange={e => {
                setData('file', e.target.files[0]);
              }}
            />

            {errors.file && <InputError>{errors.file}</InputError>}
          </div>

          <div className="mx-2">
            <Label htmlFor="link">External Link</Label>

            <Input
              type="text"
              id="link"
              name="link"
              className="mt-1"
              value={data.link}
              placeholder="enter research link"
              autoComplete="link"
              onChange={e => setData('link', e.target.value)}
            />

            {errors.link && (
              <InputError className={'mt-2'}>{errors.link}</InputError>
            )}
          </div>

          <div className="mx-2">
            <Label htmlFor="image">Featured Image</Label>

            {image && (
              <div className="w-[minmax(auto, 450px)]">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={image}
                    alt="featured"
                    className="rounded-md object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              className="mt-1"
              placeholder="Browse Image"
              onChange={e => {
                setData('image', e.target.files[0]);
                setImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {errors.image && (
              <InputError className={'mt-2'}>{errors.image}</InputError>
            )}
          </div>

          <PrimaryButton type="submit" disabled={processing}>
            Save
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
