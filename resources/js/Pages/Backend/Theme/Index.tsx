import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CreateTheme from './Partials/CreateTheme';
import EditTheme from './Partials/EditTheme';

export default function Index({ auth, themes: data }) {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const { delete: destroy, processing } = useForm();
  const { toast } = useToast();
  const handleEdit = (e, id) => {
    e.preventDefault();
    const THEME = data.find(theme => theme.id === id);
    setTheme(THEME);
    setEditFormOpen(true);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    destroy(route('admin.themes.destroy', id), {
      onSuccess: () => {
        toast({
          title: 'Theme deleted',
          description: `Theme ID:${id} deleted Successfully`,
        });
        if (!processing) {
          setTheme(null);
          setEditFormOpen(false);
        }
      },
      onError: () =>
        toast({
          title: 'Uh oh! Something went wrong.',
          description: `Cannot delete Theme ID:${id}, try again later`,
          variant: 'destructive',
        }),
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="line-clamp-[2]">{row.original.description}</span>
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
      <Head title="Themes" />

      <PrimaryButton onClick={() => setCreateFormOpen(!createFormOpen)}>
        Add new theme
      </PrimaryButton>
      {data && <DataTable defaultColumns={defaultColumns} data={data} />}

      {createFormOpen && (
        <CreateTheme
          className="max-w-xl"
          open={createFormOpen}
          setOpen={setCreateFormOpen}
        />
      )}
      {editFormOpen && (
        <EditTheme
          theme={theme}
          open={editFormOpen}
          setOpen={setEditFormOpen}
        />
      )}
    </AuthenticatedLayout>
  );
}
