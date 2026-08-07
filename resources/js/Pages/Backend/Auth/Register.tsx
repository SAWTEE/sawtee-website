import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useRef } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const { toast } = useToast();

  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    return () => {
      resetRef.current('password', 'password_confirmation');
    };
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route('register'), {
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <>
      <Head title="Register" />

      <form onSubmit={submit} noValidate>
        <FormField id="name" label="Name" error={errors.name} required>
          {field => (
            <Input
              {...field}
              name="name"
              value={data.name}
              className="mt-1 block w-full"
              autoComplete="name"
              autoFocus
              onChange={e => setData('name', e.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="email"
          label="Email"
          error={errors.email}
          required
          className="mt-4"
        >
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
          <Link
            href={route('login')}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={processing}>
            Register
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
