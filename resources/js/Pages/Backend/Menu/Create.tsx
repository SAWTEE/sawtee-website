import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateMenuForm from './Partials/CreateMenu';

export default function Create({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Menu" />

      <CreateMenuForm className="max-w-xl" />
    </AuthenticatedLayout>
  );
}
