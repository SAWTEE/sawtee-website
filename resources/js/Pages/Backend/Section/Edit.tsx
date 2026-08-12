import { Head } from '@inertiajs/react';
import React from 'react';

import EditSectionForm from './Partials/EditSectionForm';

export default function Edit({
  auth: _auth = undefined,
  sections = undefined,
  section = undefined,
  pages = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Section" />
      <EditSectionForm sections={sections} section={section} pages={pages} />
    </>
  );
}
