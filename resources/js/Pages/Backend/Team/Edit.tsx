import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditTeamForm from './Partials/EditTeamForm';

export default function Edit({ auth, team }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Team Member" />
      <EditTeamForm team={team} />
    </AuthenticatedLayout>
  );
}
