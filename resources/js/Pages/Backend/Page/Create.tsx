// @ts-nocheck
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePageForm from './Partials/CreatePageForm';

export default function Create({ auth = undefined, pages = undefined }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Page" />

      <CreatePageForm pages={pages} />
    </AuthenticatedLayout>
  );
}
