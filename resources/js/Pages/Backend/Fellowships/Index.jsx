import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import CreateFellowshipForm from './Partials/CreateFellowshipForm';
import EditFellowshipForm from './Partials/EditFellowshipForm';

export default function Index({ auth, fellowships }) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [fellowship, setFellowship] = useState(undefined);
  const { toast } = useToast();


  const handleEdit = (e, id) => {
    e.preventDefault();
    const FELLOWSHIP = fellowships.find(f => f.id === id);
    setFellowship(FELLOWSHIP);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e, id) => {
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
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mx-4"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mx-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'year',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Year" />
      ),
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
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
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
    </AuthenticatedLayout>
  );
}
