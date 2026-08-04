import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditPublishedStory from './Partials/EditPublishedStory';

export default function Edit({ auth, publishedStory, fellows }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Published Story" />
      <EditPublishedStory publishedStory={publishedStory} fellows={fellows} />
    </AuthenticatedLayout>
  );
}
