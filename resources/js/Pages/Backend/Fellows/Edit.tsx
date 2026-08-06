import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import EditFellow from './Partials/EditFellow';

export default function Edit({
  fellow = undefined,
  auth = undefined,
  fellowships = undefined,
}: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Fellow" />
      <EditFellow fellow={fellow} fellowships={fellowships} />
    </AuthenticatedLayout>
  );
}
