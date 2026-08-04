import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditResearchForm from './Partials/EditResearchForm';

export default function Edit({ research = undefined, auth = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Research" />
      <EditResearchForm research={research} />
    </AuthenticatedLayout>
  );
}
