import { Head } from '@inertiajs/react';

import EditPublishedStory from './Partials/EditPublishedStory';

export default function Edit({
  auth: _auth = undefined,
  publishedStory = undefined,
  fellows = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Published Story" />
      <EditPublishedStory publishedStory={publishedStory} fellows={fellows} />
    </>
  );
}
