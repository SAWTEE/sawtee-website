import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

export default function Index({ auth = undefined, fellows = undefined }: any) {
  const { delete: destroy, get } = useForm();
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.fellows.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.fellows.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Fellow ID:${id} deleted.`,
          description: 'Fellow deleted successfully.',
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
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'designation',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Designation" />
      ),
    },
    {
      accessorKey: 'fellowship.year',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Fellowship Year" />
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
      <Head title="Fellows" />
      <Link href={route('admin.fellows.create')}>
        <PrimaryButton>Create New Fellow</PrimaryButton>
      </Link>
      {fellows && (
        <DataTable
          defaultColumns={defaultColumns}
          data={fellows}
          customFilterColumn={'name'}
        />
      )}
    </>
  );
}
