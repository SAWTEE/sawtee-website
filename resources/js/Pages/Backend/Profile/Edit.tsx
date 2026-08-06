import { Head } from '@inertiajs/react';

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
  auth = undefined,
  mustVerifyEmail = undefined,
  status = undefined,
}: any) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      // @ts-ignore allowlist-migration
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="dark:bg-bgDarker bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          <div className="dark:bg-bgDarker bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div className="dark:bg-bgDarker bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
