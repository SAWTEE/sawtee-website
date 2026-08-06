import { Head } from '@inertiajs/react';
import React from 'react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import CreateSectionForm from './Partials/CreateSectionForm';

export default function Create({
  auth = undefined,
  sections = undefined,
  pages = undefined,
}: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Section" />
      <CreateSectionForm sections={sections} pages={pages} />
    </AuthenticatedLayout>
  );
}
