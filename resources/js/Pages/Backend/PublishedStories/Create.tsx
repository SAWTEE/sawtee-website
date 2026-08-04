import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePublishedStory from './Partials/CreatePublishedStory';

export default function Create({ auth, fellows }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Published Story" />
      <CreatePublishedStory fellows={fellows} />
    </AuthenticatedLayout>
  );
}
