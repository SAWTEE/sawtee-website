import { Head } from '@inertiajs/react';

import CreateMenuForm from './Partials/CreateMenu';

export default function Create({ auth: _auth = undefined }: any) {
  return (
    <>
      <Head title="Add New Menu" />

      <CreateMenuForm className="max-w-xl" />
    </>
  );
}
