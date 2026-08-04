import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import EditSectionForm from './Partials/EditSectionForm';

export default function Edit({ auth, sections, section, pages }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Section" />
      <EditSectionForm sections={sections} section={section} pages={pages} />
    </AuthenticatedLayout>
  );
}
