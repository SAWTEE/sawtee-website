import { Head } from '@inertiajs/react';

import CreatePublicationForm from './Partials/CreatePublicationForm';

export default function Create({
  auth: _auth = undefined,
  categories = undefined,
  tags = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Publication" />
      <CreatePublicationForm categories={categories} tags={tags} />
    </>
  );
}
