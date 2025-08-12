import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditVolumeForm from './Partials/EditVolumeForm';

export default function Edit({ auth, volume }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Volume" />

      <EditVolumeForm className="max-w-xl" volume={volume} />
    </AuthenticatedLayout>
  );
}
