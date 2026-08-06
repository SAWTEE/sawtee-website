import Glassbox from '@/components/Frontend/Glassbox';
import { useTheme } from '@/components/shared/theme-provider';
import { aboutMenuData } from '@/lib/data';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import type { MenuItem } from '@/types';

const SawteeGlobe = lazy(() => import('../globe'));

const ListVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const ListContainerVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

type MegaSectionProps = {
  item: MenuItem;
  introText?: string;
};

const AboutMegaMenu = ({ item, introText, ...rest }: MegaSectionProps) => {
  const { theme } = useTheme();
  return (
    <ul
      className="grid-rows-auto md:grid-rows-[repeat(2, minmax(auto, 250px))] relative mx-auto grid w-[60vw] grid-cols-1 place-items-center gap-4 px-6 py-10 md:grid-cols-5 md:gap-6 xl:grid-rows-[auto]"
      {...rest}
    >
      <div className="col-span-1 place-self-start md:col-span-2">
        <motion.ul
          variants={ListContainerVariants}
          initial={'closed'}
          whileInView={'open'}
        >
          {(item.children ?? []).map((child: any) => {
            return (
              <motion.li
                key={child.title}
                variants={ListVariants}
                className="lg:text-md relative cursor-pointer pb-4 text-left text-sm font-medium"
              >
                <Link
                  className="text-secondary-foreground font-sans"
                  href={child.url}
                >
                  {child.title}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
      <div className="place-center col-span-4 mx-auto md:col-span-3">
        <div className="relative flex min-h-55 w-full items-center justify-center overflow-hidden rounded-xl md:min-h-65">
          <Suspense fallback={null}>
            <SawteeGlobe darkMode={theme === 'dark'} />
          </Suspense>
          <Glassbox className="relative z-10 mx-3 my-4 max-w-prose p-5 text-justify text-xs leading-normal xl:text-sm xl:leading-6">
            {introText}
          </Glassbox>
        </div>
      </div>
    </ul>
  );
};

const OurWorkMegaMenu = ({ item, ...rest }: MegaSectionProps) => {
  const children = item.children ?? [];

  return (
    <ul
      className="mx-auto grid w-[min(90vw,56rem)] grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 md:gap-6 md:px-8"
      {...rest}
    >
      {children.map(section => (
        <li key={section.title} className="min-w-0 space-y-4 text-left">
          <Link
            href={section.url}
            className="text-secondary-foreground font-serif text-xl no-underline md:text-2xl"
          >
            {section.title}
          </Link>

          {(section.children ?? []).length > 0 ? (
            <motion.ul
              className="flex flex-col gap-1"
              variants={ListContainerVariants}
              initial={'closed'}
              whileInView={'open'}
            >
              {(section.children ?? []).map(child => (
                <motion.li
                  key={child.title}
                  variants={ListVariants}
                  className="md:text-md relative cursor-pointer py-1.5 text-sm"
                >
                  <Link
                    href={child.url}
                    className="text-secondary-foreground no-underline"
                  >
                    {child.title}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

const MegaMenu = ({
  item,
  experts: _experts,
}: {
  item: MenuItem;
  experts?: unknown[];
}) => {
  if (item.name === 'Know Us') {
    return (
      <AboutMegaMenu item={item} introText={aboutMenuData.introText} />
    );
  }
  if (item.name === 'Our Work') {
    return <OurWorkMegaMenu item={item} />;
  }

  return null;
};

export default MegaMenu;
