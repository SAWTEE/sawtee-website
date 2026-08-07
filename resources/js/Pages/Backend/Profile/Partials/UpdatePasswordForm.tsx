import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

import FormField from '@/components/Backend/FormField';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function UpdatePasswordForm({ className = '' }: any) {
  // @ts-ignore allowlist-migration
  const passwordInput = useRef();
  // @ts-ignore allowlist-migration
  const currentPasswordInput = useRef();
  const { toast } = useToast();

  const { data, setData, errors, put, reset, processing } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // @ts-ignore allowlist-migration
  const updatePassword = e => {
    e.preventDefault();

    put(route('admin.password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Password updated.',
          description: 'Your password has been updated.',
        });
        reset();
      },
      onError: errors => {
        toast({
          title: 'Uh oh, Something went wrong',
          description: 'Your password could not be updated. Please try again.',
          variant: 'destructive',
        });
        if (errors.password) {
          reset('password', 'password_confirmation');
          // @ts-ignore allowlist-migration
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          // @ts-ignore allowlist-migration
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-secondary-foreground text-lg font-medium">
          Update Password
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} noValidate className="mt-6 space-y-6">
        <FormField
          id="current_password"
          label="Current Password"
          error={errors.current_password}
          required
        >
          {field => (
            <Input
              {...field}
              // @ts-ignore allowlist-migration
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={e => setData('current_password', e.target.value)}
              type="password"
              className="mt-1 block w-full"
              autoComplete="current-password"
            />
          )}
        </FormField>

        <FormField
          id="password"
          label="New Password"
          error={errors.password}
          required
        >
          {field => (
            <Input
              {...field}
              // @ts-ignore allowlist-migration
              ref={passwordInput}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              type="password"
              className="mt-1 block w-full"
              autoComplete="new-password"
            />
          )}
        </FormField>

        <FormField
          id="password_confirmation"
          label="Confirm Password"
          error={errors.password_confirmation}
          required
        >
          {field => (
            <Input
              {...field}
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              type="password"
              className="mt-1 block w-full"
              autoComplete="new-password"
            />
          )}
        </FormField>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
        </div>
      </form>
    </section>
  );
}
