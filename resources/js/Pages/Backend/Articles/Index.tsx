import { Head, Link, useForm } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TWTags from '@/components/shared/TWTags';
import { useToast } from '@/hooks/use-toast';

export default function Index({
  auth: _auth = undefined,
  articles = undefined,
}: any) {
  const { get, delete: destroy } = useForm();
  const { toast } = useToast();

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.articles.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Post deleted',
          description: `Post ID:${id} deleted Successfully`,
        });
      },
    });
  };

  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.articles.edit', id));
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
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }: any) => {
        return row.original.tags?.map((tag: any) => (
          <TWTags key={tag.id} colorScheme="blue" className="ml-2">
            {tag.name}
          </TWTags>
        ));
      },
    },
    {
      accessorKey: 'author',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Author" />
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
      <Head title="Articles" />

      <Link href={route('admin.articles.create')}>
        <PrimaryButton>Create New Article</PrimaryButton>
      </Link>
      <DataTable defaultColumns={defaultColumns} data={articles} />
    </>
  );
}
