import { Head } from '@inertiajs/react';

import EditSliderForm from './Partials/EditSliderForm';
export default function Edit({
  auth = undefined,
  slider = undefined,
  slides = undefined,
  pages = undefined,
}: any) {
  return (
    <>
      <Head title="Add New Slider" />

      <EditSliderForm slider={slider} slides={slides} pages={pages} />
    </>
  );
}
