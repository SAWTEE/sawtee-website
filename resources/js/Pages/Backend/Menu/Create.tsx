import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import CreateMenuForm from './Partials/CreateMenu';

export default function Create({ auth = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Menu" />

      <CreateMenuForm className="max-w-xl" />
    </AuthenticatedLayout>
  );
}
