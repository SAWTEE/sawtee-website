import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditHomePageSectionForm from './Partials/EditHomePageSectionForm';

export default function Edit({ auth, section }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Section" />

      <EditHomePageSectionForm section={section} />
    </AuthenticatedLayout>
  );
}
