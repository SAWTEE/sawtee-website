import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateHomePageSectionForm from './Partials/CreateHomePageSectionForm';

export default function Create({ auth = undefined, sections = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Section" />

      {/* @ts-ignore allowlist-migration */}
      <CreateHomePageSectionForm sections={sections} />
    </AuthenticatedLayout>
  );
}
