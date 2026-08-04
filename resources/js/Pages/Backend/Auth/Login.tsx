import Checkbox from '@/components/Backend/Checkbox';
import InputError from '@/components/Backend/InputError';
import InputLabel from '@/components/Backend/InputLabel';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TextInput from '@/components/Backend/TextInput';
import GuestLayout from '@/components/Layouts/GuestLayout';
import { useToast } from '@/components/ui/use-toast';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    post(route('login'), {
      onSuccess: () => {
        toast({
          title: 'Welcome Back',
          description: `Today is ${new Date().toLocaleDateString()} and ${new Date().toLocaleTimeString()}, hope you have a productive day.`,
        });
      },
      onError: () => {
        reset('password');
      },
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={e => setData('email', e.target.value)}
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={e => setData('password', e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4 block">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={e => setData('remember', e.target.checked)}
            />
            <span className="ms-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Forgot your password?
            </Link>
          )}

          <PrimaryButton className="ms-4" disabled={processing}>
            Log in
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
