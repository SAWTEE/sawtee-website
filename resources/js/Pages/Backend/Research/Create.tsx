import { Head } from '@inertiajs/react';

import CreateResearchForm from './Partials/CreateResearchForm';

export default function Create({ auth = undefined }: any) {
  return (
    <>
      <Head title="Add New Research" />
      <CreateResearchForm />
    </>
  );
}
