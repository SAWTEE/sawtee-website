import { Link, useForm, usePage } from '@inertiajs/react';

import InputError from '@/components/Backend/InputError';
import InputLabel from '@/components/Backend/InputLabel';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TextInput from '@/components/Backend/TextInput';
import { useToast } from '@/hooks/use-toast';

export default function UpdateProfileInformation({
  mustVerifyEmail = undefined,
  status = undefined,
  className = '',
}: any) {
  // @ts-ignore allowlist-migration
  const user = usePage().props.auth.user;
  const { toast } = useToast();
  const { data, setData, patch, errors, processing } = useForm({
    name: user.name,
    email: user.email,
  });

  // @ts-ignore allowlist-migration
  const submit = e => {
    e.preventDefault();

    patch(route('admin.profile.update'), {
      onSuccess: () => {
        toast({
          title: 'Profile updated.',
          description: 'Your profile information has been updated.',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Error.',
          description: 'Something went wrong while updating your profile.',
        });
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-secondary-foreground text-lg font-medium">
          Profile Information
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Update your account&apos;s profile information and email address.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Name" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            // @ts-ignore allowlist-migration
            onChange={e => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={data.email}
            // @ts-ignore allowlist-migration
            onChange={e => setData('email', e.target.value)}
            required
            autoComplete="username"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className="mt-2 text-sm text-gray-800">
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className="mt-2 text-sm font-medium text-green-600">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
        </div>
      </form>
    </section>
  );
}
