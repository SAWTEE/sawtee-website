import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';

type ForgotPasswordProps = { status?: string };

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route('password.email'));
  };

  return (
    <>
      <Head title="Forgot Password" />

      <div className="dark:text-muted-foreground mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={submit} noValidate>
        <FormField id="email" label="Email" error={errors.email} required>
          {field => (
            <Input
              {...field}
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoFocus
              onChange={e => setData('email', e.target.value)}
            />
          )}
        </FormField>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Email Password Reset Link
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
