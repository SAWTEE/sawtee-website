import { ArrowLeft } from 'lucide-react';
import PrimaryButton from '../Backend/PrimaryButton';

const Page404 = ({ status, message }) => (
  <div className="px-6 py-10 text-center" textAlign="center" py={10} px={6}>
    <h2 className="inline-block bg-gradient-to-r from-theme-400 to-teal-600 bg-clip-text text-4xl text-white hover:via-sky-500">
      {status}
    </h2>
    <p className="my-3 text-lg">{message}</p>
    <p className="mb-6 text-slate-500">
      The page you&apos;re looking for does not seem to exist
    </p>
    <Link href="/">
      <PrimaryButton className="bg-gradient-to-r from-theme-400 to-teal-600 text-white hover:via-sky-500">
        <ArrowLeft className="mr-2 h-6 w-6" /> {'Go back Home'}
      </PrimaryButton>
    </Link>
  </div>
);

export default Page404;
