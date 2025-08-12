import PrimaryButton from '@/components/Backend/PrimaryButton';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, volumes  }) {
  const { toast } = useToast();
  const { processing, delete: destroy, get } = useForm();

  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.trade-insight-volumes.edit', id));
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.trade-insight-volumes.destroy', id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Trade Insight Volume deleted.',
          description: 'Trade Insight Volume deleted Successfully',
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
      accessorKey: 'volume',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Volume" />;
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
      <Head title="Trade Insight Volumes" />

      <Link href={route('admin.trade-insight-volumes.create')}>
        <PrimaryButton>Add New Volume</PrimaryButton>
      </Link>
      {volumes && <DataTable defaultColumns={defaultColumns} data={volumes} />}
    </AuthenticatedLayout>
  );
}
