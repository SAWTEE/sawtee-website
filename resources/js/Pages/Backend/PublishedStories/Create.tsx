import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import CreatePublishedStory from './Partials/CreatePublishedStory';

export default function Create({ auth = undefined, fellows = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Published Story" />
      <CreatePublishedStory fellows={fellows} />
    </AuthenticatedLayout>
  );
}
