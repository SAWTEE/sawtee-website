import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import EditPageForm from './Partials/EditPageForm';

export default function Edit({ auth = undefined, page = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Page" />

      <EditPageForm page={page} />
    </AuthenticatedLayout>
  );
}
