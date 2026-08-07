import { Head, Link, useForm } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TWTags from '@/components/shared/TWTags';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function Index({ auth = undefined, articles = undefined }: any) {
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
