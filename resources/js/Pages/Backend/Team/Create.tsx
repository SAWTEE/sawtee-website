import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateTeamForm from './Partials/CreateTeamForm';

export default function Create({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Team Member" />

      <CreateTeamForm className="max-w-xl" />
    </AuthenticatedLayout>
  );
}
