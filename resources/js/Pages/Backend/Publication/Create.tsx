// @ts-nocheck
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePublicationForm from './Partials/CreatePublicationForm';

export default function Create({ auth = undefined, categories = undefined, tags = undefined }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Publication" />
      <CreatePublicationForm categories={categories} tags={tags} />
    </AuthenticatedLayout>
  );
}
