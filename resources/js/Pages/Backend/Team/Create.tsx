import { Head } from '@inertiajs/react';

import CreateTeamForm from './Partials/CreateTeamForm';

export default function Create({ auth: _auth = undefined }: any) {
  return (
    <>
      <Head title="Add New Team Member" />

      {/* @ts-ignore allowlist-migration */}
      <CreateTeamForm className="max-w-xl" />
    </>
  );
}
