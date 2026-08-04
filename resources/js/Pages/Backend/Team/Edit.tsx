import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditTeamForm from './Partials/EditTeamForm';

export default function Edit({ auth = undefined, team = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Team Member" />
      <EditTeamForm team={team} />
    </AuthenticatedLayout>
  );
}
