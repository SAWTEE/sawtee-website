import { Head } from '@inertiajs/react';

import CreatePublishedStory from './Partials/CreatePublishedStory';

export default function Create({
  auth: _auth = undefined,
  fellows = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Published Story" />
      <CreatePublishedStory fellows={fellows} />
    </>
  );
}
