import {
  ChevronsRight,
  Mailbox,
  MailOpen,
  MapPinned,
  PhoneIncoming,
  PhoneOff,
} from 'lucide-react';
import { useState } from 'react';

import InertiaLink from '@/components/shared/InertiaLink';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { SocialMenu } from '../header/social-menu';
import { MapModel } from '../MapModal';
// import { SubscribeForm } from '../NewsletterCallout';

export default function Footer({
  menu = [],
  socialMenu = [],
}: {
  menu?: any[];
  socialMenu?: any[];
}) {
  const [mapModal, setMapModal] = useState(false);

  return (
    <footer className="bg-bgDarker w-full overflow-x-clip text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          <div className="col-span-full flex w-full min-w-0 flex-col gap-5 sm:col-span-2 md:col-span-3 lg:col-span-2 lg:mb-0">
            <InertiaLink
              href="/"
              className="mx-auto flex w-full justify-center lg:mx-0 lg:justify-start"
            >
              <img
                src="/assets/logo-sawtee.svg"
                alt="SAWTEE"
                width={128}
                height={32}
                className="h-8 w-32 object-contain"
              />
            </InertiaLink>

            {/* SubscribeForm removed — home callout + archive sidebars already cover signup. */}
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
              <p className="text-secondary-foreground/85 text-sm leading-relaxed">
                Research, advocacy, and capacity building on trade, economics,
                and environment across South Asia.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm lg:justify-start">
                <InertiaLink
                  href="/about"
                  className="text-primary font-medium underline-offset-2 hover:underline"
                >
                  About SAWTEE
                </InertiaLink>
                <InertiaLink
                  href="/contact"
                  className="text-primary font-medium underline-offset-2 hover:underline"
                >
                  Contact
                </InertiaLink>
                <a
                  href="https://sawteenp.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium underline-offset-2 hover:underline"
                >
                  Substack
                </a>
              </div>
              {/* <SubscribeForm /> */}
            </div>
          </div>
          {Object.entries(menu ?? []).map(([key, item]) => {
            return (
              <div key={key} className="w-full min-w-0 text-left">
                <h2 className="text-secondary-foreground mb-4 text-lg font-medium sm:mb-5 sm:text-xl">
                  {item.title}
                </h2>
                <ul className="text-[0.9rem] transition-all duration-500">
                  {item.title.includes('Contact')
                    ? item.children?.map((child_item: any) => {
                        const { url, title } = child_item;
                        if (title.includes('Address')) {
                          return (
                            <MenuItem key={title} className="items-start">
                              <MapPinned className="mt-0.5 h-5 w-5 shrink-0" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="relative min-w-0 text-left"
                                    asChild
                                  >
                                    <button
                                      type="button"
                                      className="wrap-break-words min-w-0 cursor-pointer text-left hyphens-auto"
                                      onClick={() => setMapModal(!mapModal)}
                                    >
                                      {title}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Click to view map
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <MapModel
                                isOpen={mapModal}
                                onOpenChange={setMapModal}
                              />
                            </MenuItem>
                          );
                        }
                        if (title.includes('Email')) {
                          return (
                            <MenuItem key={title}>
                              <MailOpen className="h-4 w-4 shrink-0" />
                              <a
                                className="wrap-break-words min-w-0"
                                href={`mailto:${url}`}
                              >
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Phone')) {
                          return (
                            <MenuItem key={title}>
                              <PhoneIncoming className="h-4 w-4 shrink-0" />
                              <a
                                className="wrap-break-words min-w-0"
                                href={`tel:${url}`}
                              >
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Fax')) {
                          return (
                            <MenuItem key={title}>
                              <PhoneOff className="h-4 w-4 shrink-0" />
                              <a
                                className="wrap-break-words min-w-0"
                                href={`tel:${url}`}
                              >
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Box')) {
                          return (
                            <MenuItem key={title}>
                              <Mailbox className="h-4 w-4 shrink-0" />
                              <span className="wrap-break-words min-w-0">
                                {title}
                              </span>
                            </MenuItem>
                          );
                        }
                      })
                    : item.children?.map((child_item: any) => {
                        const { url, title } = child_item;
                        return (
                          <MenuItem key={title}>
                            <ChevronsRight className="h-4 w-4 shrink-0" />
                            {title.includes('SAES') ? (
                              <a
                                href={url}
                                target="_blank"
                                referrerPolicy="no-referrer"
                                rel="noopener noreferrer"
                                className="wrap-break-words min-w-0"
                              >
                                {title}
                              </a>
                            ) : (
                              <InertiaLink
                                className="wrap-break-words min-w-0"
                                href={url}
                              >
                                {title}
                              </InertiaLink>
                            )}
                          </MenuItem>
                        );
                      })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="border-t border-gray-200/80 py-6 sm:py-7">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
            <span className="text-secondary-foreground text-sm leading-relaxed">
              ©<InertiaLink href="/">{' SAWTEE'}</InertiaLink>{' '}
              {new Date().getFullYear() + ' All rights reserved. '}
            </span>
            <SocialMenu
              menu={socialMenu}
              className="mt-0 flex flex-wrap items-center justify-center gap-x-4 space-x-0 gap-y-2"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

const MenuItem = ({ children = undefined, className = '' }: any) => {
  return (
    <li
      className={cn(
        'text-secondary-foreground/90 dark:text-secondary-foreground/80 dark:hover:text-secondary-foreground mb-3 flex w-full min-w-0 items-center justify-start gap-2 last:mb-0 hover:text-slate-900 sm:mb-4',
        className
      )}
    >
      {children}
    </li>
  );
};
