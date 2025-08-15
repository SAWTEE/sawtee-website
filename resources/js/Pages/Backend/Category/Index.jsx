import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateCategoryForm from './Partials/CreateCategoryForm';
import EditCategoryForm from './Partials/EditCategoryForm';

export default function Index({ auth, categories }) {
  const { delete: destroy } = useForm();
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [category, setCatgory] = useState(undefined);
  const { toast } = useToast();
  const handleEdit = (e, id) => {
    e.preventDefault();
    // get(route('admin.categories.edit', id));
    const cat = categories.find(c => c.id === id);
    setCatgory(cat);
    setEditFormOpen(!editFormOpen);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.categories.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: `Category ID:${id} deleted.`,
          description: 'Category deleted successfully.',
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    // {
    //   accessorKey: 'parent',
    //   header: 'Parent Category',
    //   cell: ({ row }) => {
    //     return row.original.parent ? row.original.parent.name : 'N/A';
    //   },
    // },
    {
      accessorKey: 'parent.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parent Category" />
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
      <Head title="Categories" />
      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Create New Category
      </PrimaryButton>
      <CreateCategoryForm
        open={createFormOpen}
        setOpen={setCreateFormOpen}
        categories={categories}
      />
      {category && editFormOpen && (
        <EditCategoryForm
          open={editFormOpen}
          setOpen={setEditFormOpen}
          category={category}
          categories={categories}
        />
      )}
      {categories && (
        <DataTable
          defaultColumns={defaultColumns}
          data={categories}
          customFilterColumn={'name'}
        />
      )}
    </AuthenticatedLayout>
  );
}
