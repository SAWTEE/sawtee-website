import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import PrimaryButton from '../Backend/PrimaryButton';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function NewsletterCallout() {
  return (
    <div className="px-6 py-6 bg-sky-700 rounded-lg dark:bg-gray-800 md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-2xl font-extrabold leading-8 tracking-tight text-white sm:text-3xl sm:leading-9">
          Receive the latest publication releases, events and monthly
          newsletter.
        </h2>
        <p className="max-w-3xl mt-3 text-lg leading-6 text-indigo-200">
          In order to receive the newsletter, you must be subscribed to the
          mailing list.
        </p>
      </div>
      <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <SubscribeForm />
        </div>
        <p className="mt-3 text-sm leading-5 text-indigo-200">
          We care about the protection of your data. Your data is safe and never
          used for commercial purposes.
        </p>
        {/* <p class="text-sm leading-5 text-indigo-200">
          In order to receive the notifications, you must give permission
          sufficient to your web browser.
        </p> */}
      </div>
    </div>
  );
}

const SubscribeForm = ({ ...rest }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
  });

  const [message, setMessage] = useState(null);

  const submit = e => {
    e.preventDefault();
    post(route('subscription.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setMessage(`${data.email} has subscribed successfully.`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        reset('email');
      },
      onError: errors => {
        console.log(errors);
      },
    });
  };

  return (
    <form
      className="flex flex-col gap-4 w-full mt-5"
      onSubmit={submit}
      {...rest}
    >
      <Input
        type="email"
        id="email"
        name="email"
        className="p-3 h-9 text-sm placeholder:text-gray-200 border-zinc-200 focus:border-primary"
        placeholder="Enter your email address"
        value={data.email}
        onChange={e => {
          setData('email', e.target.value);
        }}
      />
      {errors.email && <InputError mt={2}>{errors.email}</InputError>}

      <PrimaryButton
        type="submit"
        isLoading={processing}
        className="flex items-center justify-center w-full px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-sky-500 border border-transparent rounded-md hover:bg-sky-400 focus:outline-none focus:bg-sky-400"
      >
        Subscribe
      </PrimaryButton>

      {message && <p className="text-lime-400 text-sm">{message}</p>}
    </form>
  );
};