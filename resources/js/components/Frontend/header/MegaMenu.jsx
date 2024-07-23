import { Separator } from '@/components/ui/separator';
import { aboutMenuData } from '@/lib/data';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
      className="relative grid gap-6 px-6 mx-auto md:grid-cols-5 lg:grid-cols-7 grid-rows-auto md:grid-rows-[repeat(2, minmax(auto, 250px))] xl:grid-rows-[auto] p-4 w-[85vw] grid-cols-1 px-8 py-10 gap-4  bg-opacity-90 backdrop-filter backdrop-blur-lg place-items-center"
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
                className="text-sm text-left lg:text-md font-medium relative cursor-pointer pb-4"
              >
                <Link className=" font-serif" link={child.url}>
                  {child.title}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
      <div className="md:col-span-3 xl:col-span-3 place-center mx-auto">
        <div
          className="relative flex justify-center items-center overflow-hidden rounded-xl bg-no-repeat bg-cover bg-center px-6 py-12"
          style={{
            backgroundImage: `url(${introImage})`,
            after: {
              content: "''",
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backdropFilter: 'blur(3px)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backgroundBlendMode: 'multiply',
            },
          }}
        >
          <p className="text-sm text-gray-200 m-0 self-center z-20 px-6 leading-8">
            {introText}
          </p>
        </div>
      </div>
      <div className=" md:col-span-5 xl:col-span-3 row-span-1 gap-4">
        <p className="text-xl pb-4 font-semibold">Our Experts</p>
        <div className="grid md:grid-cols-6 xl:grid-cols-3 gap-4">
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
    <ul
      className="grid p-4 w-[85vw] grid-cols-1 px-8 py-10 gap-4  bg-opacity-90 backdrop-filter backdrop-blur-lg"
      {...rest}
    >
      <div className="w-full flex flex-col gap-10 justify-center items-center mx-auto">
        <Link className="text-2xl font-serif" href={item.children[0].url}>
          {item.children[0].title}
        </Link>
        <motion.ul
          variants={ListContainerVariants}
          initial={'closed'}
          whileInView={'open'}
          className="grid grid-cols-2 gap-4 w-full"
        >
          {item.children[0].children.map(grandChild => {
            return (
              <motion.li
                key={grandChild.title}
                variants={ListVariants}
                className="text-sm md:text-md col-span-1 relative cursor-pointer pb-3 "
              >
                <Link href={grandChild.url} className="no-underline">
                  {grandChild.title}{' '}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        <Separator className="w-full my-4 border-b-2" />
        <div className="grid grid-cols-2 gap-6">
          {item.children.map((grandChildren, idx) => {
            if (idx !== 0) {
              return (
                <div className="col-span-1 space-y-6" key={grandChildren.title}>
                  <Link
                    href={grandChildren.url}
                    className="no-underline text-2xl"
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
                          className="text-sm col-span-1 md:text-md relative cursor-pointer pb-3"
                        >
                          <Link href={child.url} className="no-underline">
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
