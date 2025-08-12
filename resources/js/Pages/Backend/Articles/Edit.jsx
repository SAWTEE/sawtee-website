import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditArticleForm from './Partials/EditArticleForm';

export default function Edit({ auth, article, volumes, tags }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Article" />

      <EditArticleForm className="max-w-xl" article={article} volumes={volumes} tags={tags} />
    </AuthenticatedLayout>
  );
}
