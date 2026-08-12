import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { useToast } from '@/hooks/use-toast';

import CreateMember from './Partials/CreateMember';
import EditMember from './Partials/EditMember';

export default function Index({
  auth: _auth = undefined,
  members = undefined,
}: any) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [member, setMember] = useState(undefined);
  const { toast } = useToast();
  const handleEdit = (e: any, id: any) => {
    e.preventDefault();
    // get(route('admin.categories.edit', id));
    // @ts-ignore allowlist-migration
    const Member = members.find(m => m.id === id);
    setMember(Member);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.members.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Member ID:${id} deleted.`,
          description: 'Member deleted successfully.',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
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
      accessorKey: 'country',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Country" />
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
      <Head title="Mmebers" />
      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Create New Member
      </PrimaryButton>
      <CreateMember open={createFormOpen} setOpen={setCreateFormOpen} />
      {member && editFormOpen && (
        <EditMember
          open={editFormOpen}
          setOpen={setEditFormOpen}
          member={member}
        />
      )}
      {members && (
        <DataTable
          defaultColumns={defaultColumns}
          data={members}
          customFilterColumn={'country'}
        />
      )}
    </>
  );
}
