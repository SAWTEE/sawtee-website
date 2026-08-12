import { Head } from '@inertiajs/react';
import React from 'react';

import CreateSectionForm from './Partials/CreateSectionForm';

export default function Create({
  auth: _auth = undefined,
  sections = undefined,
  pages = undefined,
}: any) {
  return (
    <>
      <Head title="Create Section" />
      <CreateSectionForm sections={sections} pages={pages} />
    </>
  );
}
