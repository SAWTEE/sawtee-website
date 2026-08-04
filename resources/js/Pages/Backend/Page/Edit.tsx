import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditPageForm from './Partials/EditPageForm';

export default function Edit({ auth, page }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Page" />

      <EditPageForm page={page} />
    </AuthenticatedLayout>
  );
}
