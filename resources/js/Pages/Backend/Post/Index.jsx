import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';

import PrimaryButton from '@/components/Backend/PrimaryButton';
import TWTags from '@/components/shared/TWTags';

export default function Index({ auth, posts, categories, categoryID }) {
  const { get, delete: destroy } = useForm();
  const { toast } = useToast();

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.posts.destroy', id), {
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

  const Status = ({ status }) => {
    switch (status) {
      case 'unpublished':
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
            {status}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/10">
            {status}
          </span>
        );
    }
  };

  const handleEdit = (e, post_id, category_id) => {
    e.preventDefault();
    get(route('admin.posts.edit', post_id, category_id));
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'theme',
      header: 'Theme',
      cell: ({ row }) => {
        return row.original.theme ? row.original.theme.title : 'N/A';
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        return row.original.tags?.map(tag => (
          <TWTags key={tag.id} colorScheme="blue" className="ml-2">
            {tag.name}
          </TWTags>
        ));
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return <Status status={row.original.status} />;
      },
    },
    {
      accessorKey: 'author',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
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
      <Head title="Posts" />

      <Link href={route('admin.posts.create')}>
        <PrimaryButton>Create New Post</PrimaryButton>
      </Link>
      <DataTable
        defaultColumns={defaultColumns}
        data={posts}
        showTypeFilter={true}
        typeFilterOptions={{
          iterable: categories,
          selectedId: categoryID,
          route: '/admin/posts',
        }}
      />
    </AuthenticatedLayout>
  );
}
