import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import EditSectionForm from './Partials/EditSectionForm';

export default function Edit({ auth = undefined, sections = undefined, section = undefined, pages = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Section" />
      <EditSectionForm sections={sections} section={section} pages={pages} />
    </AuthenticatedLayout>
  );
}
