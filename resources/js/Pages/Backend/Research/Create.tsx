import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateResearchForm from './Partials/CreateResearchForm';

export default function Create({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Research" />
      <CreateResearchForm />
    </AuthenticatedLayout>
  );
}
