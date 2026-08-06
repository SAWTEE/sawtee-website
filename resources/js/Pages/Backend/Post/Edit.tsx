import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import EditPostForm from './Partials/EditPostForm';

export default function Edit({
  post = undefined,
  auth = undefined,
  categories = undefined,
  tags = undefined,
  themes = undefined,
  categoryID = undefined,
}: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Post" />

      <EditPostForm
        post={post}
        categories={categories}
        tags={tags}
        themes={themes}
        categoryID={categoryID}
      />
    </AuthenticatedLayout>
  );
}
