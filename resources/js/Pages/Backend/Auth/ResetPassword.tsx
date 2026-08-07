import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useRef } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';

type ResetPasswordProps = { token: string; email: string };

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    return () => {
      resetRef.current('password', 'password_confirmation');
    };
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route('password.store'));
  };

  return (
    <>
      <Head title="Reset Password" />

      <form onSubmit={submit} noValidate>
        <FormField id="email" label="Email" error={errors.email} required>
          {field => (
            <Input
              {...field}
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="username"
              onChange={e => setData('email', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password}
          required
          className="mt-4"
        >
          {field => (
            <Input
              {...field}
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              autoComplete="new-password"
              autoFocus
              onChange={e => setData('password', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="password_confirmation"
          label="Confirm Password"
          error={errors.password_confirmation}
          required
          className="mt-4"
        >
          {field => (
            <Input
              {...field}
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full"
              autoComplete="new-password"
              onChange={e => setData('password_confirmation', e.target.value)}
            />
          )}
        </FormField>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Reset Password
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
