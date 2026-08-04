// @ts-nocheck
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateArticleForm from './Partials/CreateArticleForm';

export default function Create({ auth = undefined, tags = undefined, volumes = undefined }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Article" />

      <CreateArticleForm className="max-w-xl" tags={tags} volumes={volumes} />
    </AuthenticatedLayout>
  );
}
