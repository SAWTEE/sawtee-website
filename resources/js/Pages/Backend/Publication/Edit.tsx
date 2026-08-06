import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import EditPublicationForm from './Partials/EditPublicationForm';

export default function Edit({
  publication = undefined,
  auth = undefined,
  categories = undefined,
  tags = undefined,
}: any) {
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
