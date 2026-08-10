import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

export default function Index({
  auth = undefined,
  researchs: data = undefined,
}: any) {
  const { delete: destroy, get } = useForm();
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.research.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.research.destroy', id), {
      onSuccess: () => {
        toast({
          title: 'Research deleted.',
          description: 'Research deleted successfully.',
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
      accessorKey: 'title',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'subtitle',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Subtitle" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: false,
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
      <Head title="Research" />
      <Link href={route('admin.research.create')}>
        <PrimaryButton>Add New Research</PrimaryButton>
      </Link>
      {data && (
        <DataTable
          defaultColumns={defaultColumns}
          data={data}
          showTypeFilter={false}
        />
      )}
    </>
  );
}
