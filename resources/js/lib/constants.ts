export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
};

export const MULTIDIRECTION_SLIDE_VARIANTS = {
  hidden: { opacity: 0, x: '-25vw' },
  visible: { opacity: 1, x: 0 },
  right: { opacity: 0, x: '25vw' },
};

export const wordVariants = {
  hidden: { opacity: 0 },
  visible: i => ({ y: 0, opacity: 1, transition: { delay: i * 0.1 } }),
};
export const pullupVariant = {
  initial: { y: 100, opacity: 0 },
  animate: i => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05, // Delay each letter's animation by 0.05 seconds
    },
  }),
};

export const ListItemVariant = {
  open: {
    y: 0,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const ListVariant = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
