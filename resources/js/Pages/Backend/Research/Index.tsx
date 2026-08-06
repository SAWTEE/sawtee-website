import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

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
      id: 'select',
      header: ({ table }: any) => (
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
      cell: ({ row }: any) => (
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
    <AuthenticatedLayout user={auth.user}>
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
    </AuthenticatedLayout>
  );
}
