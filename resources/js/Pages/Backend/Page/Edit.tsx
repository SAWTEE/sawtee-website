import { Head } from '@inertiajs/react';

import EditPageForm from './Partials/EditPageForm';

export default function Edit({ auth = undefined, page = undefined }: any) {
  return (
    <>
      <Head title="Edit Page" />

      <EditPageForm page={page} />
    </>
  );
}
