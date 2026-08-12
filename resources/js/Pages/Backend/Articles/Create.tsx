import { Head } from '@inertiajs/react';

import CreateArticleForm from './Partials/CreateArticleForm';

export default function Create({
  auth: _auth = undefined,
  tags = undefined,
  volumes = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Article" />

      <CreateArticleForm className="max-w-xl" tags={tags} volumes={volumes} />
    </>
  );
}
