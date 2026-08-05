import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateArticleForm from './Partials/CreateArticleForm';

export default function Create({ auth = undefined, tags = undefined, volumes = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Article" />

      <CreateArticleForm className="max-w-xl" tags={tags} volumes={volumes} />
    </AuthenticatedLayout>
  );
}
