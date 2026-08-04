import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePageForm from './Partials/CreatePageForm';

export default function Create({ auth, pages }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Page" />

      <CreatePageForm pages={pages} />
    </AuthenticatedLayout>
  );
}
