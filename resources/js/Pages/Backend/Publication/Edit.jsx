import AuthenticatedLayout from '@/Pages/Backend/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditPublicationForm from './Partials/EditPublicationForm';

export default function Edit({ publication, auth, categories, tags }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Publication" />
      <EditPublicationForm categories={categories} publication={publication} tags={tags} />
    </AuthenticatedLayout>
  );
}
