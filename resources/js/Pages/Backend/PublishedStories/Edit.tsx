import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditPublishedStory from './Partials/EditPublishedStory';

export default function Edit({ auth = undefined, publishedStory = undefined, fellows = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Published Story" />
      <EditPublishedStory publishedStory={publishedStory} fellows={fellows} />
    </AuthenticatedLayout>
  );
}
