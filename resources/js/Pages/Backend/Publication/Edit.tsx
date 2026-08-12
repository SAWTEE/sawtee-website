import { Head } from '@inertiajs/react';

import EditPublicationForm from './Partials/EditPublicationForm';

export default function Edit({
  publication = undefined,
  auth: _auth = undefined,
  categories = undefined,
  tags = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Publication" />
      <EditPublicationForm
        categories={categories}
        publication={publication}
        tags={tags}
      />
    </>
  );
}
