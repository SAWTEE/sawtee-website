import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useToast } from '@/hooks/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth = undefined, pages = undefined }: any) {
  const { get, delete: destroy } = useForm();

  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.pages.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.pages.destroy', id), {
      onSuccess: () => {
        toast({
          title: 'Page deleted.',
          description: `Page ID:${id} deleted Successfully`,
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
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
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'slug',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
    },
    {
      accessorKey: 'sections_count',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Sections Count" />
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }: any) => (
        <DataTableActions
          id={row.original.id}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ),
      enableHiding: false,
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Pages" />
      <Link href={route('admin.pages.create')}>
        <PrimaryButton>Create New Page</PrimaryButton>
      </Link>
      {pages && (
        <DataTable
          defaultColumns={defaultColumns}
          data={pages}
          customFilterColumn={'name'}
        />
      )}
    </AuthenticatedLayout>
  );
}
