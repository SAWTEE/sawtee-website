import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

import CreateFeature from './Partials/CreateFeature';
import EditFeature from './Partials/EditFeature';

export default function Index({
  auth: _auth = undefined,
  features: data = undefined,
}: any) {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [feature, setFeature] = useState(null);
  const { delete: destroy, processing } = useForm();
  const { toast } = useToast();

  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    // @ts-ignore allowlist-migration
    const selected = data.find((item: any) => item.id === id);
    setFeature(selected);
    setEditFormOpen(true);
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.features.destroy', id), {
      onSuccess: () => {
        toast({
          title: 'Feature deleted',
          description: `Feature ID:${id} deleted Successfully`,
        });
        if (!processing) {
          setFeature(null);
          setEditFormOpen(false);
        }
      },
      onError: () =>
        toast({
          title: 'Uh oh! Something went wrong.',
          description: `Cannot delete Feature ID:${id}, try again later`,
          variant: 'destructive',
        }),
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
      header: 'Link',
    },
    {
      accessorKey: 'sort_order',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Visible',
      cell: ({ row }: any) => (row.original.is_active ? 'Yes' : 'No'),
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
      <Head title="Features" />

      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Add new feature
      </PrimaryButton>
      {data && <DataTable defaultColumns={defaultColumns} data={data} />}

      {createFormOpen && (
        <CreateFeature
          className="max-w-xl"
          open={createFormOpen}
          setOpen={setCreateFormOpen}
        />
      )}
      {editFormOpen && (
        <EditFeature
          feature={feature}
          open={editFormOpen}
          setOpen={setEditFormOpen}
        />
      )}
    </>
  );
}
