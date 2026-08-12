import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

export default function Index({
  auth: _auth = undefined,
  publishedStories = undefined,
}: any) {
  const { delete: destroy, get } = useForm();
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.published-stories.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.published-stories.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Story ID:${id} deleted.`,
          description: 'Story deleted successfully.',
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
      accessorKey: 'title',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'link',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
    },
    {
      accessorKey: 'fellow.name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Story by" />
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
      <Head title="Published Stories" />
      <Link href={route('admin.published-stories.create')}>
        <PrimaryButton>Create New Story</PrimaryButton>
      </Link>
      {publishedStories && (
        <DataTable
          defaultColumns={defaultColumns}
          data={publishedStories}
          customFilterColumn={'title'}
        />
      )}
    </>
  );
}
