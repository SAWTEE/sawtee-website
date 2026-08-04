import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../components/Layouts/MainLayout';

const ErrorPage = ({ status }) => {
  const title = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }[status];

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status];
  return (
    <MainLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-4xl font-bold text-gray-800">{title}</h1>
          <p className="mb-6 text-gray-600">{description}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600"
          >
            Go back to homepage
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorPage;
