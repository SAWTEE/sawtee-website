import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    ChevronsRight,
    Mailbox,
    MailOpen,
    MapPinned,
    PhoneIncoming,
    PhoneOff,
} from 'lucide-react';
import { useState } from 'react';
import { SocialMenu } from '../header/social-menu';
import { MapModel } from '../MapModal';
import { SubscribeForm } from '../NewsletterCallout';

export default function Footer({ menu, socialMenu }) {
  const [mapModal, setMapModal] = useState(false);

  return (
    <footer className="w-full bg-bgDarker text-slate-500">
      <div className="mx-auto max-w-7xl px-8">
        <div className="grid max-w-sm grid-cols-2 gap-3 gap-y-8 py-10 sm:mx-auto sm:max-w-full sm:grid-cols-3 md:gap-8 lg:grid-cols-5">
          <div className="col-span-full mb-10 flex w-full flex-col gap-5 lg:col-span-2 lg:mb-0">
            <Link
              href="/"
              className="mx-auto flex w-32 justify-center lg:mx-0 lg:justify-start"
            >
              <img
                src="/assets/logo-sawtee.svg"
                alt="logo"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="flex w-2/3 flex-col items-center justify-center gap-3 lg:items-start">
              <SubscribeForm
                // buttonStyles={'bg-primary dark:text-slate-700 text-white'}
              />
            </div>
          </div>
          {menu && Object.entries(menu).map(([key, item]) => {
            return (
              <div
                key={key}
                className="col-span-2 w-full justify-self-center text-left sm:col-span-1 sm:mx-auto"
              >
                <h4 className="mb-7 text-xl font-medium text-secondary-foreground">
                  {item.title}
                </h4>
                <ul className="text-[0.9rem] transition-all duration-500">
                  {item.title.includes('Contact')
                    ? item.children?.map(child_item => {
                        const { url, title } = child_item;
                        if (title.includes('Address')) {
                          return (
                            <MenuItem key={title}>
                              <MapPinned className="h-6 w-6" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="relative text-left">
                                    <a
                                      role="button"
                                      type="button"
                                      className="flex cursor-pointer break-all"
                                      onClick={() => setMapModal(!mapModal)}
                                    >
                                      {title}
                                    </a>
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
                              <MailOpen className="h-4 w-4" />
                              <a className="" href={`mailto:${url}`}>
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Phone')) {
                          return (
                            <MenuItem key={title}>
                              <PhoneIncoming className="h-4 w-4" />
                              <a className="" href={`tel:${url}`}>
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Fax')) {
                          return (
                            <MenuItem key={title}>
                              <PhoneOff className="h-4 w-4" />
                              <a className="" href={`tel:${url}`}>
                                {title}
                              </a>
                            </MenuItem>
                          );
                        }
                        if (title.includes('Box')) {
                          return (
                            <MenuItem key={title}>
                              <Mailbox className="h-4 w-4" />
                              {title}
                            </MenuItem>
                          );
                        }
                      })
                    : item.children?.map(child_item => {
                        const { url, title } = child_item;
                        return (
                          <MenuItem key={title}>
                            <ChevronsRight className="h-4 w-4" />
                            {title.includes('SAES') ? (
                              <a
                                href={url}
                                target="_blank"
                                referrerPolicy="no-referrer"
                              >
                                {title}
                              </a>
                            ) : (
                              <Link href={url}>{title}</Link>
                            )}
                          </MenuItem>
                        );
                      })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="border-t border-gray-200 py-7">
          <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between">
            <span className="text-sm text-secondary-foreground">
              ©<Link href="/">{' SAWTEE'}</Link>{' '}
              {new Date().getFullYear() + ' All rights reserved. '}
            </span>
            <div className="mt-4 flex space-x-4 sm:justify-center lg:mt-0">
              <SocialMenu menu={socialMenu} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const MenuItem = ({ children, className }) => {
  return (
    <li
      className={cn(
        'mb-4 flex w-full items-center justify-start gap-2 text-secondary-foreground/90 hover:text-slate-900 dark:text-secondary-foreground/80 dark:hover:text-secondary-foreground',
        className
      )}
    >
      {children}
    </li>
  );
};
