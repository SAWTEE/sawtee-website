import { Head } from '@inertiajs/react';

import EditTeamForm from './Partials/EditTeamForm';

export default function Edit({
  auth: _auth = undefined,
  team = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Team Member" />
      <EditTeamForm team={team} />
    </>
  );
}
