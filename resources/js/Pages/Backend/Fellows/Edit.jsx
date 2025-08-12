import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditFellow from './Partials/EditFellow';

export default function Edit({ fellow, auth, fellowships }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Fellow" />
      <EditFellow fellow={fellow} fellowships={fellowships} />
    </AuthenticatedLayout>
  );
}
