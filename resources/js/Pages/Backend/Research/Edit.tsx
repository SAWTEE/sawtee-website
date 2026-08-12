import { Head } from '@inertiajs/react';

import EditResearchForm from './Partials/EditResearchForm';

export default function Edit({
  research = undefined,
  auth: _auth = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Research" />
      <EditResearchForm research={research} />
    </>
  );
}
