import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateMember from './Partials/CreateMember';
import EditMember from './Partials/EditMember';

export default function Index({ auth, members }) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [member, setMember] = useState(undefined);
  const { toast } = useToast();
  const handleEdit = (e, id) => {
    e.preventDefault();
    // get(route('admin.categories.edit', id));
    const Member = members.find(m => m.id === id);
    setMember(Member);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e, id) => {
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
      accessorKey: 'country',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Country" />
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
      <Head title="Mmebers" />
      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Create New Member
      </PrimaryButton>
      <CreateMember
        open={createFormOpen}
        setOpen={setCreateFormOpen}
      />
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
    </AuthenticatedLayout>
  );
}
