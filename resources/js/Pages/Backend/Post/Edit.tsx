import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EditPostForm from './Partials/EditPostForm';

export default function Edit({
  post,
  auth,
  categories,
  tags,
  themes,
  categoryID,
}) {
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
