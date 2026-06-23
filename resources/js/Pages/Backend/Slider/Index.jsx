import DataTableActions from '@/components/Backend/DataTableActions';
import { AlertCircleIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import CreateSliderForm from './Partials/CreateSliderForm';

export default function Index({ auth, sliders, pages }) {
  const { toast } = useToast();
  const { delete: destroy, get } = useForm();
  const [sliderModal, setSliderModal] = React.useState(false);

  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.sliders.edit', id));
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.sliders.destroy', id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          position: 'top-right',
          title: 'Slider deleted.',
          description: 'Slider deleted Successfully',
          status: 'error',
          duration: 6000,
          isClosable: true,
        }),
      onError: () => console.error('Error while deleting'),
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
      accessorKey: 'name',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Title" />;
      },
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
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Sliders" />
      {sliders.length <= 0 && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircleIcon />
          <AlertTitle>
            <strong>Warning</strong>
          </AlertTitle>
          <AlertDescription>
            There are no sliders to add slides to, please create a slider first
            by clicking the add new slider button below.
          </AlertDescription>
        </Alert>
      )}
      <Button onClick={() => setSliderModal(!sliderModal)}>
        Create Slider
      </Button>
      {sliders && (
        <DataTable
          defaultColumns={defaultColumns}
          data={sliders}
          customFilterColumn={'name'}
        />
      )}
      {sliderModal && (
        <CreateSliderForm
          open={sliderModal}
          setOpen={setSliderModal}
          pages={pages}
        />
      )}
    </AuthenticatedLayout>
  );
}
