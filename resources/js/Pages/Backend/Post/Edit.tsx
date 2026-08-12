import { Head } from '@inertiajs/react';

import EditPostForm from './Partials/EditPostForm';

export default function Edit({
  post = undefined,
  auth: _auth = undefined,
  categories = undefined,
  tags = undefined,
  themes = undefined,
  categoryID = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Post" />

      <EditPostForm
        post={post}
        categories={categories}
        tags={tags}
        themes={themes}
        categoryID={categoryID}
      />
    </>
  );
}
