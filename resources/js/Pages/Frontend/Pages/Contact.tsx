import { SocialMenu } from '@/components/Frontend/header/social-menu';
import ZoomableImage from '@/components/Frontend/ZoomableImage';
import type { ContactPageData, PageData } from '@/types';
import { Mail, MapPin, Phone, PhoneOff } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

function isContactPageData(
  data: PageData | undefined
): data is ContactPageData {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}

type ContactProps = {
  pageData?: PageData;
  content?: string | null;
};

const Contact = ({ pageData }: ContactProps) => {
  if (!isContactPageData(pageData)) {
    return (
      <section className="contact-page-content mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-20 lg:py-24">
        <div className="border-borderColor/70 bg-bgDarker/80 rounded-lg border border-l-[3px] border-l-[#006181] p-6 shadow-sm md:p-10 dark:border-white/10 dark:border-l-[#006181]/80 dark:bg-black/40">
          <h2 className="text-primary text-center font-serif text-2xl font-semibold tracking-tight md:text-3xl dark:text-zinc-100">
            South Asia Watch on Trade, Economics and Environment (SAWTEE)
          </h2>
          <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed md:text-base">
            Contact details are unavailable right now. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const phoneNumbers = pageData.phone_numbers ?? [];

  return (
    <section className="contact-page-content mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-20 lg:py-24">
      <div className="border-borderColor/70 bg-bgDarker/80 rounded-lg border border-l-[3px] border-l-[#006181] p-6 shadow-sm md:p-10 dark:border-white/10 dark:border-l-[#006181]/80 dark:bg-black/40">
        <header className="mb-8 border-b border-[#006181]/12 pb-8 text-center md:mb-10 md:pb-10 dark:border-[#006181]/20">
          <h2 className="text-primary font-serif text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl dark:text-zinc-100">
            South Asia Watch on Trade, Economics and Environment (SAWTEE)
          </h2>
          <div className="text-muted-foreground mt-4 space-y-1 text-sm md:text-base">
            <p>
              <span className="text-primary/80 font-medium dark:text-zinc-200">
                Working days:
              </span>{' '}
              Monday–Friday
            </p>
            {pageData.opening_hours ? (
              <p>
                <span className="text-primary/80 font-medium dark:text-zinc-200">
                  Office hours:
                </span>{' '}
                {pageData.opening_hours}
              </p>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <ul className="space-y-3">
              {phoneNumbers.map(number => {
                return (
                  <Fragment key={number}>
                    <li>
                      <ContactAction href={`tel:${number}`}>
                        <Phone className="h-4 w-4 shrink-0" aria-hidden />
                        {number}
                      </ContactAction>
                    </li>
                  </Fragment>
                );
              })}

              {pageData.fax ? (
                <li>
                  <ContactAction>
                    <PhoneOff className="h-4 w-4 shrink-0" aria-hidden />
                    {pageData.fax}
                  </ContactAction>
                </li>
              ) : null}

              {pageData.email ? (
                <li>
                  <ContactAction href={`mailto:${pageData.email}`}>
                    <Mail className="h-4 w-4 shrink-0" aria-hidden />
                    {pageData.email}
                  </ContactAction>
                </li>
              ) : null}

              {pageData.address ? (
                <li>
                  <ContactAction>
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    {pageData.address}
                  </ContactAction>
                </li>
              ) : null}
            </ul>

            <SocialMenu
              className="mt-6 sm:justify-start"
              menu={pageData.social_menus}
            />
          </div>

          {pageData.location_image ? (
            <div className="overflow-hidden rounded-md border border-[#006181]/12 dark:border-[#006181]/25">
              <ZoomableImage
                className="aspect-square w-full object-cover"
                src={pageData.location_image}
                alt="SAWTEE office location"
              />
            </div>
          ) : null}
        </div>

        {pageData.map_url ? (
          <div className="mt-10 overflow-hidden rounded-md border border-[#006181]/12 md:mt-12 dark:border-[#006181]/25">
            <iframe
              src={pageData.map_url}
              className="aspect-video w-full"
              height="500"
              allowFullScreen={true}
              loading="lazy"
              title="Map of SAWTEE office location"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

const ContactAction = ({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) => {
  const className =
    'text-secondary-foreground inline-flex items-center gap-2.5 text-[0.95rem] leading-relaxed transition-colors hover:text-[#006181] focus-visible:text-[#006181] focus-visible:outline-none md:text-base dark:text-zinc-300 dark:hover:text-[#4da3c0] dark:focus-visible:text-[#4da3c0]';

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
};

export default Contact;
