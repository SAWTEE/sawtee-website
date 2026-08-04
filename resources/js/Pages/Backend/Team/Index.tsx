import PrimaryButton from '@/components/Backend/PrimaryButton';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, teams }) {
  const { toast } = useToast();
  const { delete: destroy, get } = useForm();

  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.teams.edit', id));
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.teams.destroy', id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Team member deleted.',
          description: 'Team member deleted Successfully',
        }),
      onError: () => console.log('Error while deleting'),
    });
  };

  const defaultColumns = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />;
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email" />;
      },
    },
    {
      accessorKey: 'designation',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Designation" />;
      },
    },
    {
      accessorKey: 'media',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Image" />;
      },
      cell: ({ row }) => {
        return (
          <img
            src={row.original.media[0]?.preview_url}
            alt={row.original.name}
            className="h-8 w-8 rounded-full"
          />
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => (
        <DataTableActions
          id={row.original.id}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Team Members" />

      <Link href={route('admin.teams.create')}>
        <PrimaryButton>Add New Member</PrimaryButton>
      </Link>
      {teams && <DataTable defaultColumns={defaultColumns} data={teams} />}
    </AuthenticatedLayout>
  );
}
