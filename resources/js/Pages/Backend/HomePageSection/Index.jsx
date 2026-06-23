import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';

import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, sections }) {
  const { get, delete: destroy } = useForm();

  const { toast } = useToast();
  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.home-page-sections.edit', id));
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.home-page-sections.destroy', id), {
      onSuccess: () => {
        toast({
          title: 'Section deleted.',
          description: `Section ID:${id} deleted Successfully`,
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Desription" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'order',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'show',
      header: 'Section Visible',
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.original.show}
            className="data-[state=checked]:bg-green-500"
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
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ),
      enableHiding: false,
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Home Page Sections" />
      <Link href={route('admin.home-page-sections.create')}>
        <PrimaryButton>Create New Section</PrimaryButton>
      </Link>
      {sections && (
        <DataTable
          defaultColumns={defaultColumns}
          data={sections}
          customFilterColumn={'name'}
        />
      )}
    </AuthenticatedLayout>
  );
}
