import { Head } from '@inertiajs/react';

import CreateHomePageSectionForm from './Partials/CreateHomePageSectionForm';

export default function Create({
  auth: _auth = undefined,
  sections = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Section" />

      {/* @ts-ignore allowlist-migration */}
      <CreateHomePageSectionForm sections={sections} />
    </>
  );
}
