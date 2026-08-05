import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePageForm from './Partials/CreatePageForm';

export default function Create({ auth = undefined, pages = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Page" />

      {/* @ts-ignore allowlist-migration */}
      <CreatePageForm pages={pages} />
    </AuthenticatedLayout>
  );
}
