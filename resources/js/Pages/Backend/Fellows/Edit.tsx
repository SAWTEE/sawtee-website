import { Head } from '@inertiajs/react';

import EditFellow from './Partials/EditFellow';

export default function Edit({
  fellow = undefined,
  auth = undefined,
  fellowships = undefined,
}: any) {
  return (
    <>
      <Head title="Edit Fellow" />
      <EditFellow fellow={fellow} fellowships={fellowships} />
    </>
  );
}
