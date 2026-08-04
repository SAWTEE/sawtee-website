import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreatePostForm from './Partials/CreatePostForm';

export default function Create({ auth = undefined, categories = undefined, themes = undefined, tags = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Post" />
      <CreatePostForm categories={categories} themes={themes} tags={tags} />
    </AuthenticatedLayout>
  );
}
