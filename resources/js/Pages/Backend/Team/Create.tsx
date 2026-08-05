import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateTeamForm from './Partials/CreateTeamForm';

export default function Create({ auth = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Team Member" />

      {/* @ts-ignore allowlist-migration */}
      <CreateTeamForm className="max-w-xl" />
    </AuthenticatedLayout>
  );
}
