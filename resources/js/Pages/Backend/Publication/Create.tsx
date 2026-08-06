import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import CreatePublicationForm from './Partials/CreatePublicationForm';

export default function Create({
  auth = undefined,
  categories = undefined,
  tags = undefined,
}: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Publication" />
      <CreatePublicationForm categories={categories} tags={tags} />
    </AuthenticatedLayout>
  );
}
