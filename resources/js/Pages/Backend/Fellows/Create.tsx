import { Head } from '@inertiajs/react';

import CreateFellow from './Partials/CreateFellow';

export default function Create({
  auth = undefined,
  fellowships = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Fellow" />
      <CreateFellow fellowships={fellowships} />
    </>
  );
}
