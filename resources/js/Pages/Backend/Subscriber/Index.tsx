import { Head } from '@inertiajs/react';
import React from 'react';

import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import TWTags from '@/components/shared/TWTags';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

export default function Index({
  auth = undefined,
  subscribers = undefined,
}: any) {
  const defaultColumns = [
    {
      accessorKey: 'id',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="ID" />;
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="Email" />;
      },
    },
    {
      accessorKey: 'verified_at',
      header: ({ column }: any) => {
        return <DataTableColumnHeader column={column} title="Verified" />;
      },
      cell: ({ row }: any) => {
        return (
          <TWTags colorScheme={row.original.verified_at ? 'green' : 'red'}>
            {row.original.verified_at ? 'Verified' : 'Not Verified'}
          </TWTags>
        );
      },
    },
  ];

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Subscribers" />
      {subscribers.length === 0 && (
        <p className="text-center text-gray-500">No Subscribers Found</p>
      )}
      {subscribers.length > 0 && (
        <DataTable
          defaultColumns={defaultColumns}
          data={subscribers}
          customFilterColumn={'email'}
        />
      )}
    </AuthenticatedLayout>
  );
}
