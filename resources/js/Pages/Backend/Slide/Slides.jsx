import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react';
import EditSlideForm from './EditSlideForm';

const Slides = ({ slides, slider }) => {
  const { toast } = useToast();
  const { processing, delete: destroy } = useForm();
  const [editSlide, setEditSlide] = useState(null);
  const [editSlideFormShow, setEditSlideFormShow] = useState(false);

  const handleEdit = (e, id) => {
    e.preventDefault();
    const slideToEdit = slides.find(slide => slide.id === id);
    setEditSlide(slideToEdit);
    setEditSlideFormShow(!editSlideFormShow);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.slides.destroy', id, slider.id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Slider deleted.',
          description: 'Slider deleted Successfully',
        }),
      onError: () => console.log('Error while deleting'),
    });
  };

  const defaultColumns = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ID" />;
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Title" />;
      },
    },
    {
      accessorKey: 'subtitle',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Subtitle" />;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'media',
      header: 'Slide Image',
      cell: ({ row }) => {
        return (
          <div className="w-[180px] rounded-md border-2 border-slate-700">
            <AspectRatio ratio={5 / 2}>
              <img
                src={row.original.media[0]?.preview_url}
                alt="slide"
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <DataTableActions
            id={row.original.id}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        );
      },
      enableHiding: false,
      enableSorting: false,
    },
  ];
  return (
    <>
      {editSlideFormShow && editSlide && (
        <EditSlideForm
          open={editSlideFormShow}
          setOpen={setEditSlideFormShow}
          slide={editSlide}
          setEditSlide={setEditSlide}
        />
      )}

      <DataTable defaultColumns={defaultColumns} data={slides} />
    </>
  );
};

export default Slides;
