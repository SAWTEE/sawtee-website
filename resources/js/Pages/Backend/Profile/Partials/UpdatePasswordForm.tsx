import InputError from '@/components/Backend/InputError';
import InputLabel from '@/components/Backend/InputLabel';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TextInput from '@/components/Backend/TextInput';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const { toast } = useToast();

  const { data, setData, errors, put, reset, processing } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

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
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-secondary-foreground">
          Update Password
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" />

          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={e => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="current-password"
          />

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" />

          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />

          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={e => setData('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>
        </div>
      </form>
    </section>
  );
}
