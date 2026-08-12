import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

import CreateMemberInstitute from './Partials/CreateMemberInstitute';
import EditMemberInstitute from './Partials/EditMemberInstitute';

export default function Index({
  auth: _auth = undefined,
  members = undefined,
  institutes = undefined,
}: any) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [institute, setInstitute] = useState(undefined);
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    // get(route('admin.categories.edit', id));
    // @ts-ignore allowlist-migration
    const Institute = institutes.find(ins => ins.id === id);
    setInstitute(Institute);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.institutes.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Institute ID:${id} deleted.`,
          description: 'Institute deleted successfully.',
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
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'link',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
    },
    {
      accessorKey: 'logo_image_src',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="logo" />
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
      <Head title="Institutes" />
      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Create New Institute
      </PrimaryButton>
      <CreateMemberInstitute
        open={createFormOpen}
        setOpen={setCreateFormOpen}
        members={members}
      />
      {institute && editFormOpen && (
        <EditMemberInstitute
          open={editFormOpen}
          setOpen={setEditFormOpen}
          institute={institute}
          members={members}
        />
      )}
      {members && (
        <DataTable
          defaultColumns={defaultColumns}
          data={institutes}
          customFilterColumn={'name'}
        />
      )}
    </>
  );
}
