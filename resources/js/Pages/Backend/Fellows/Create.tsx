import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateFellow from './Partials/CreateFellow';

export default function Create({ auth = undefined, fellowships = undefined }: any) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Fellow" />
      <CreateFellow fellowships={fellowships} />
    </AuthenticatedLayout>
  );
}
