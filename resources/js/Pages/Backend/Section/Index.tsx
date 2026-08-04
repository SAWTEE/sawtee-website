import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';
export default function Index({ auth, sections }) {
  const { toast } = useToast();
  const { delete: destroy, get } = useForm();

  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.sections.edit', id));
  };

  const handleDelete = (e, id) => {
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
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ID" />;
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Title" />;
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Type" />;
      },
    },

    {
      accessorKey: 'parent_id',
      header: 'Parent Section',
      cell: ({ row }) => {
        return sections.find(
          section => section.id === row.getValue('parent_id')
        )?.title;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'page.name',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="For Page" />;
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
      enableSorting: false,
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Sections" />

      <Link href={route('admin.sections.create')}>
        <PrimaryButton>Create New Section</PrimaryButton>
      </Link>
      {sections && (
        <DataTable defaultColumns={defaultColumns} data={sections} />
      )}
    </AuthenticatedLayout>
  );
}
