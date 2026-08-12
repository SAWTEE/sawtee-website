import { Head, Link, useForm } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';
export default function Index({
  auth: _auth = undefined,
  sections = undefined,
}: any) {
  const { toast } = useToast();
  const { delete: destroy, get } = useForm();

  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.sections.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.sections.destroy', id), {
      preserveScroll: true,
      onSuccess: () =>
        toast({
          title: 'Category deleted.',
          description: 'Category deleted Successfully',
        }),
      onError: () => console.log('Error while deleting'),
    });
  };

  const defaultColumns = [
    {
      accessorKey: 'id',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="ID" />;
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="Title" />;
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="Type" />;
      },
    },

    {
      accessorKey: 'parent_id',
      header: 'Parent Section',
      cell: ({ row }: any) => {
        return sections.find(
          // @ts-ignore allowlist-migration
          section => section.id === row.getValue('parent_id')
        )?.title;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'page.name',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="For Page" />;
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
      enableSorting: false,
    },
  ];

  return (
    <>
      <Head title="Sections" />

      <Link href={route('admin.sections.create')}>
        <PrimaryButton>Create New Section</PrimaryButton>
      </Link>
      {sections && (
        <DataTable defaultColumns={defaultColumns} data={sections} />
      )}
    </>
  );
}
