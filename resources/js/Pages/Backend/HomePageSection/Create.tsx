import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateHomePageSectionForm from './Partials/CreateHomePageSectionForm';

export default function Create({ auth, sections }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Section" />

      <CreateHomePageSectionForm sections={sections} />
    </AuthenticatedLayout>
  );
}
