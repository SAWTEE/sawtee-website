import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { SocialMenu } from '@/components/Frontend/header/social-menu';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, PhoneOff } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

const Contact = ({ pageData = undefined }: any) => {
  return (
    <section className="contact-page-content mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <div className="rounded-xl bg-bgDarker p-6 shadow-lg md:p-12">
        <p className="mb-4 text-center text-2xl font-bold md:text-4xl">
          South Asia Watch on Trade, Economics and Environment (SAWTEE)
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="space-y-2 pb-3 text-xl uppercase md:text-2xl">
              <p className="font-semibold">
                Working days:{' ' + 'Monday-Friday'}
              </p>
              <p className="text-lg font-semibold">
                Office hours:
                {` ${pageData.opening_hours}`}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 py-3 md:py-6 lg:items-start lg:py-8">
              {pageData.phone_numbers.map((number: any) => {
                return (
                  <Fragment key={number}>
                    <ActionButton href={`tel:${number}`}>
                      <Phone className="mr-2 h-5 w-5" aria-hidden />
                      {number}
                    </ActionButton>
                  </Fragment>
                );
              })}

              <ActionButton>
                <PhoneOff className="mr-2 h-5 w-5" aria-hidden />
                {pageData.fax}
              </ActionButton>

              <ActionButton href={`mailto:${pageData.email}`}>
                <Mail className="mr-2 h-5 w-5" aria-hidden />
                {pageData.email}
              </ActionButton>
              <ActionButton>
                <MapPin className="mr-2 h-5 w-5" aria-hidden />
                {pageData.address}
              </ActionButton>
            </div>

            <SocialMenu
              className="sm:justify-start"
              menu={pageData.social_menus}
            />
          </div>

          <div className="max-h-96 p-8">
            <Zoom>
              <img
                className="aspect-square w-full object-cover"
                src={pageData.location_image}
                alt="SAWTEE office location"
                loading="lazy"
              />
            </Zoom>
          </div>
        </div>
        {pageData.map_url && (
          <div className="mt-8 aspect-video">
            <iframe
              src={pageData.map_url}
              width="100%"
              height="500"
              // @ts-ignore allowlist-migration
              allowFullScreen="true"
              loading="lazy"
              title="Map of SAWTEE office location"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  );
};

const ActionButton = ({
  href,
  children,
  ...rest
}: {
  href?: string;
  children?: ReactNode;
}) => {
  if (href) {
    return (
      <Button variant="link" asChild {...rest}>
        <a className="flex items-center" href={href}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button variant="link" type="button" {...rest}>
      <span className="flex items-center">{children}</span>
    </Button>
  );
};

export default Contact;
