import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import { Link } from "@inertiajs/react";

export default function Index({ auth, fellows }) {
  const { delete: destroy, get } = useForm();
  const { toast } = useToast();
  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.fellows.edit', id));
  };

  const handleDelete = (e, id) => {
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'designation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Designation" />
      ),
    },
    {
      accessorKey: 'fellowship.year',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fellowship Year" />
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
      <Head title="Fellows" />
       <Link href={route('admin.fellows.create')}>
      <PrimaryButton>
        Create New Fellow
      </PrimaryButton>
       </Link>
      {fellows && (
        <DataTable
          defaultColumns={defaultColumns}
          data={fellows}
          customFilterColumn={'name'}
        />
      )}
    </AuthenticatedLayout>
  );
}
