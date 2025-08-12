import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import CreateVolumeForm from './Partials/CreateVolumeForm';

export default function Create({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Volume" />

      <CreateVolumeForm className="max-w-xl" />
    </AuthenticatedLayout>
  );
}
