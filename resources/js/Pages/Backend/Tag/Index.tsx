import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateTag from './Partials/CreateTag';
import EditTag from './Partials/EditTag';

export default function Index({ auth, tags }) {
  const [tag, setTag] = React.useState(null);
  const [createTag, setCreateTag] = useState(false);
  const [editTag, setEditTag] = useState(false);

  const { delete: destroy } = useForm();
  const { toast } = useToast();

  const handleEdit = (e, id) => {
    e.preventDefault();
    const Tag = tags.find(t => t.id === id);
    setTag(Tag);
    setEditTag(!editTag);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.tags.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Tag deleted',
          description: `Tag ID:${id} deleted Successfully`,
        });
      },
      onError: () => {
        toast({
          title: 'Uh oh, Something went wrong',
          description: `Tag ID:${id} was not deleted, try again.`,
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
      accessorKey: 'posts_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Post Count" />
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
      <Head title="Tags" />

      <PrimaryButton onClick={() => setCreateTag(!createTag)}>
        Create New Tag
      </PrimaryButton>
      {tags && (
        <DataTable
          defaultColumns={defaultColumns}
          data={tags}
          customFilterColumn={'name'}
        />
      )}
      {createTag && <CreateTag open={createTag} setOpen={setCreateTag} />}
      {editTag && <EditTag tag={tag} open={editTag} setOpen={setEditTag} />}
    </AuthenticatedLayout>
  );
}
