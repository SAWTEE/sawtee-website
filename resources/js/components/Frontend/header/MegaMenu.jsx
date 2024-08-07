import { Separator } from '@/components/ui/separator';
import { aboutMenuData } from '@/lib/data';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Globeanime from '../globeanime';
import ExpertCard from './ExpertCard';

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

const AboutMegaMenu = ({ item, experts, introText, introImage, ...rest }) => {
  return (
    <ul
      className="grid-rows-auto md:grid-rows-[repeat(2, minmax(auto, 250px))] relative mx-auto grid w-[90vw] grid-cols-1 place-items-center gap-4 gap-6 p-4 px-6 px-8 py-10 md:grid-cols-5 lg:grid-cols-7 xl:grid-rows-[auto]"
      {...rest}
    >
      <div className="col-span-1 self-center">
        <motion.ul
          variants={ListContainerVariants}
          initial={'closed'}
          whileInView={'open'}
        >
          {item.children.map(child => {
            return (
              <motion.li
                key={child.title}
                as={motion.li}
                variants={ListVariants}
                className="lg:text-md relative cursor-pointer pb-4 text-left text-sm font-medium"
              >
                <Link className="font-serif text-gray-200" link={child.url}>
                  {child.title}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
      <div className="place-center mx-auto md:col-span-3 xl:col-span-3">
        {/* <div
          className="relative flex justify-center items-center overflow-hidden rounded-xl bg-no-repeat bg-cover bg-center px-6 py-12 after:content:' ' after:absolute after:inset-0 after:w-full after:z-10 after:h-full after:bg-[#000]/[0.4] bg-blend-multiply blur-[1px]"
          style={{
            backgroundImage: `url(${introImage})`,
          }}
        > */}
        <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-black/40 bg-cover bg-right-bottom bg-no-repeat">
          <Globeanime />
          <p className="z-20 m-0 flex h-full w-full items-center justify-center self-center bg-[rgba(0,0,0,0.3)] px-6 text-justify text-sm leading-6 text-gray-200">
            {introText}
          </p>
        </div>
      </div>
      <div className="row-span-1 gap-4 md:col-span-5 xl:col-span-3">
        <p className="pb-4 text-xl font-semibold text-gray-200">Our Experts</p>
        <div className="grid gap-4 md:grid-cols-6 xl:grid-cols-3">
          {experts?.map(expert => {
            return (
              <div key={expert.name} className="col-span-1">
                <ExpertCard expert={expert} />
              </div>
            );
          })}
        </div>
      </div>
    </ul>
  );
};

const OurWorkMegaMenu = ({ item, ...rest }) => {
  return (
    <ul className="grid w-[90vw] grid-cols-1 gap-4 p-4 px-8 py-10" {...rest}>
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-10">
        <Link
          className="font-serif text-2xl text-gray-200"
          href={item.children[0].url}
        >
          {item.children[0].title}
        </Link>
        <motion.ul
          variants={ListContainerVariants}
          initial={'closed'}
          whileInView={'open'}
          className="grid w-full grid-cols-2 gap-4"
        >
          {item.children[0].children.map(grandChild => {
            return (
              <motion.li
                key={grandChild.title}
                variants={ListVariants}
                className="md:text-md relative col-span-1 cursor-pointer pb-3 text-sm"
              >
                <Link
                  href={grandChild.url}
                  className="text-gray-200 no-underline"
                >
                  {grandChild.title}{' '}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        <Separator className="my-4 w-full border-b-2" />
        <div className="grid grid-cols-2 gap-6">
          {item.children.map((grandChildren, idx) => {
            if (idx !== 0) {
              return (
                <div className="col-span-1 space-y-6" key={grandChildren.title}>
                  <Link
                    href={grandChildren.url}
                    className="text-2xl text-gray-200 no-underline"
                  >
                    {grandChildren.title}
                  </Link>

                  <motion.ul
                    className="grid grid-cols-2 gap-6"
                    variants={ListContainerVariants}
                    initial={'closed'}
                    whileInView={'open'}
                  >
                    {grandChildren.children?.map(child => {
                      return (
                        <motion.li
                          key={child.title}
                          variants={ListVariants}
                          className="md:text-md relative col-span-1 cursor-pointer pb-3 text-sm"
                        >
                          <Link
                            href={child.url}
                            className="text-gray-200 no-underline"
                          >
                            {child.title}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              );
            }
          })}
        </div>
      </div>
    </ul>
  );
};

const MegaMenu = ({ item, experts = null }) => {
  if (item.name === 'Know Us') {
    return (
      <AboutMegaMenu
        item={item}
        experts={experts}
        introText={aboutMenuData.introText}
        introImage={aboutMenuData.introImage}
      />
    );
  }
  if (item.name === 'Our Work') {
    return <OurWorkMegaMenu item={item} />;
  }
};

export default MegaMenu;
