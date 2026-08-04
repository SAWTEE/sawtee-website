// @ts-nocheck
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditPublicationForm from './Partials/EditPublicationForm';

export default function Edit({ publication = undefined, auth = undefined, categories = undefined, tags = undefined }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Publication" />
      <EditPublicationForm
        categories={categories}
        publication={publication}
        tags={tags}
      />
    </AuthenticatedLayout>
  );
}
