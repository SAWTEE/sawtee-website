// @ts-nocheck
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';

import { Head } from '@inertiajs/react';
import EditSliderForm from './Partials/EditSliderForm';
export default function Edit({ auth = undefined, slider = undefined, slides = undefined, pages = undefined }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add New Slider" />

      <EditSliderForm slider={slider} slides={slides} pages={pages} />
    </AuthenticatedLayout>
  );
}
