import { Head, Link, useForm } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function Index({ auth = undefined, sections = undefined }: any) {
  const { get, delete: destroy } = useForm();

  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.home-page-sections.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
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
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Desription" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'order',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'show',
      header: 'Section Visible',
      cell: ({ row }: any) => {
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
    <>
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
    </>
  );
}
