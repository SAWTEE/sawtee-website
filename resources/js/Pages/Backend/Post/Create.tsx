import { Head } from '@inertiajs/react';

import CreatePostForm from './Partials/CreatePostForm';

export default function Create({
  auth: _auth = undefined,
  categories = undefined,
  themes = undefined,
  tags = undefined,
}: any) {
  return (
    <>
      <Head title="Create Post" />
      <CreatePostForm categories={categories} themes={themes} tags={tags} />
    </>
  );
}
