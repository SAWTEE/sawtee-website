import DataTableActions from '@/components/Backend/DataTableActions';
import PrimaryButton from '@/components/Backend/PrimaryButton';

import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { HStack, useDisclosure } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import CreateSliderForm from './Partials/CreateSliderForm';

export default function Index({ auth, sliders, pages }) {
  const { toast } = useToast();
  const { processing, delete: destroy, get } = useForm();
  const createSliderModal = useDisclosure();

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
        <Alert variant="destructive">
          <AlertIcon />
          <AlertTitle>
            <strong>Warning</strong>
          </AlertTitle>
          <AlertDescription>
            There are no sliders to add slides to, please create a slider first
            by clicking the add new slider button below.
          </AlertDescription>
        </Alert>
      )}
      <PrimaryButton mb={4} onClick={() => createSliderModal.onOpen()}>
        Create Slider
      </PrimaryButton>
      {sliders && (
        <DataTable
          defaultColumns={defaultColumns}
          data={sliders}
          customFilterColumn={'name'}
        />
      )}
      {createSliderModal.isOpen && (
        <CreateSliderForm
          isOpen={createSliderModal.isOpen}
          onClose={createSliderModal.onClose}
          pages={pages}
        />
      )}
    </AuthenticatedLayout>
  );
}
