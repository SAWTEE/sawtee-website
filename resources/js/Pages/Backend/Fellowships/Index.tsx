import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

import CreateFellowshipForm from './Partials/CreateFellowshipForm';
import EditFellowshipForm from './Partials/EditFellowshipForm';

export default function Index({
  auth = undefined,
  fellowships = undefined,
}: any) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [fellowship, setFellowship] = useState(undefined);
  const { toast } = useToast();

  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    // @ts-ignore allowlist-migration
    const FELLOWSHIP = fellowships.find(f => f.id === id);
    setFellowship(FELLOWSHIP);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.fellowships.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Fellowship ID:${id} deleted.`,
          description: 'Fellowship deleted successfully.',
        });
      },
      onError: () => {
        toast({
          title: 'Error.',
          description: 'Something went wrong. Please try again.',
        });
      },
    });
  };

  const defaultColumns = [
    {
      accessorKey: 'id',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'year',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Year" />
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }: any) => {
        return (
          <DataTableActions
            id={row.original.id}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        );
      },
      enableHiding: false,
    },
  ];

  return (
    <>
      <Head title="Fellowships" />
      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Create New Fellowship
      </PrimaryButton>
      <CreateFellowshipForm
        open={createFormOpen}
        setOpen={setCreateFormOpen}
        fellowhips={fellowships}
      />
      {fellowship && editFormOpen && (
        <EditFellowshipForm
          open={editFormOpen}
          setOpen={setEditFormOpen}
          fellowship={fellowship}
        />
      )}
      {fellowships && (
        <DataTable
          defaultColumns={defaultColumns}
          data={fellowships}
          customFilterColumn={'title'}
        />
      )}
    </>
  );
}
