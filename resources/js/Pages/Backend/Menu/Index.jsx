import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTable } from '@/components/Backend/FrontDataTable';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateMenu from './Partials/CreateMenu';
export default function Index({ auth, menus }) {
  const { get, delete: destroy } = useForm();
  const [createMenu, setCreateMenu] = useState(false);
  const { toast } = useToast();

  const handleEdit = (e, id) => {
    e.preventDefault();
    get(route('admin.manage.menus', id));
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.delete.menu', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu deleted',
          description: `Menu ID:${id} deleted Successfully`,
        });
      },
      onError: () => {
        toast({
          title: 'Uh oh, Something went wrong',
          description: `Menu ID:${id} was not deleted, try again.`,
        });
      },
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
      accessorKey: 'location',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Location" />;
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
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Menus" />
      {menus.length <= 0 && (
        <Alert>
          <AlertTitle>No menu!</AlertTitle>
          <AlertDescription>Create a menu to add menu items. </AlertDescription>
        </Alert>
      )}

      <Button onClick={() => setCreateMenu(!createMenu)}>Add New Menu</Button>
      {menus && <DataTable defaultColumns={defaultColumns} data={menus} />}
      {createMenu && <CreateMenu open={createMenu} setOpen={setCreateMenu} />}
    </AuthenticatedLayout>
  );
}
