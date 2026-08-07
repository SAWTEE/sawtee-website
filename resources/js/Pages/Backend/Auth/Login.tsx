import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Checkbox from '@/components/Backend/Checkbox';
import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

type LoginProps = { status?: string; canResetPassword?: boolean };

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>(
    {
      email: '',
      password: '',
      remember: false,
    }
  );

  const { toast } = useToast();

  const submit = (e: FormEvent) => {
    e.preventDefault();

    // Always submit a real boolean — Inertia keeps remember in useForm data
    // (Laravel recaller persistence, not credential autofill).
    post(route('login'), {
      onSuccess: () => {
        toast({
          title: 'Welcome Back',
          description: `Today is ${new Date().toLocaleDateString()} and ${new Date().toLocaleTimeString()}, hope you have a productive day.`,
        });
      },
      onError: errors => {
        toastFormErrors(errors, toast);
        reset('password');
      },
    });
  };

  return (
    <>
      <Head title="Log in" />

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
              autoComplete="username"
              autoFocus
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
              autoComplete="current-password"
              onChange={e => setData('password', e.target.value)}
            />
          )}
        </FormField>

        <div className="mt-4 block">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={e => setData('remember', Boolean(e.target.checked))}
            />
            <span className="ms-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Forgot your password?
            </Link>
          )}

          <PrimaryButton className="ms-4" disabled={processing}>
            Log in
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
