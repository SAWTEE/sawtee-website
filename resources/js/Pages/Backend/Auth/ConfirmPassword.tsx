import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, [reset]);

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route('password.confirm'));
  };

  return (
    <>
      <Head title="Confirm Password" />

      <div className="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password
        before continuing.
      </div>

      <form onSubmit={submit} noValidate>
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
              autoFocus
              onChange={e => setData('password', e.target.value)}
            />
          )}
        </FormField>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Confirm
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
