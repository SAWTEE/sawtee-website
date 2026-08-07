import { Head } from '@inertiajs/react';

import EditHomePageSectionForm from './Partials/EditHomePageSectionForm';

export default function Edit({ auth = undefined, section = undefined }: any) {
  return (
    <>
      <Head title="Edit Section" />

      <EditHomePageSectionForm section={section} />
    </>
  );
}
