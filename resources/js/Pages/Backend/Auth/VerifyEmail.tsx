import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import PrimaryButton from '@/components/Backend/PrimaryButton';

type VerifyEmailProps = { status?: string };

export default function VerifyEmail({ status }: VerifyEmailProps) {
  const { post, processing } = useForm({});

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route('verification.send'));
  };

  return (
    <>
      <Head title="Email Verification" />

      <div className="text-muted-foreground mb-4 text-sm">
        Thanks for signing up! Before getting started, could you verify your
        email address by clicking on the link we just emailed to you? If you
        didn&apos;t receive the email, we will gladly send you another.
      </div>

      {status === 'verification-link-sent' && (
        <div className="text-success mb-4 text-sm font-medium">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton disabled={processing}>
            Resend Verification Email
          </PrimaryButton>

          <Link
            href={route('admin.logout')}
            method="post"
            as="button"
            className="text-muted-foreground hover:text-foreground focus:ring-ring rounded-md text-sm underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Log Out
          </Link>
        </div>
      </form>
    </>
  );
}
