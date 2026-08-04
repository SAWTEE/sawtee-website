import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditResearchForm from './Partials/EditResearchForm';

export default function Edit({ research, auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Research" />
      <EditResearchForm research={research} />
    </AuthenticatedLayout>
  );
}
