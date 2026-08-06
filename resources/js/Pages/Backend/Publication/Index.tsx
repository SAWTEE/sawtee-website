import { Head, Link, useForm } from '@inertiajs/react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function Index({
  auth = undefined,
  publications: data = undefined,
  categories = undefined,
  categoryID = undefined,
}: any) {
  const { get, delete: destroy } = useForm();
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    get(route('admin.publications.edit', id));
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.publications.destroy', id), {
      onSuccess: () =>
        toast({
          title: 'Publication Deleted',
          description: `Publication ID:${id} deleted successfully`,
        }),
      // @ts-ignore allowlist-migration
      onError: toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      }),
    });
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
    // {
    //   accessorKey: 'description',
    //   header: ({ column }: any) => (
    //     <DataTableColumnHeader column={column} title="Description" />
    //   ),
    // },
    {
      accessorKey: 'category.name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
    },
    {
      accessorKey: 'tags',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      cell: ({ row }: any) => {
        return row.original.tags?.map((tag: any) => (
          <span
            key={tag.id}
            className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-500/10 ring-inset"
          >
            {tag.name}
          </span>
        ));
      },
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
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Publications" />
      <Link href={route('admin.publications.create')}>
        <PrimaryButton>Add New Publication</PrimaryButton>
      </Link>
      <DataTable
        defaultColumns={defaultColumns}
        data={data}
        showTypeFilter={true}
        typeFilterOptions={{
          iterable: categories,
          selectedId: categoryID,
          route: '/admin/publications',
        }}
      />
    </AuthenticatedLayout>
  );
}
