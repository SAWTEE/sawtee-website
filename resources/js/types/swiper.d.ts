import type { CSSProperties, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

type SwiperContainerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  init?: string | boolean;
  navigation?: string | boolean;
  pagination?: string | boolean;
  scrollbar?: string | boolean;
  keyboard?: string | boolean;
  loop?: string | boolean;
  'slides-per-view'?: string | number;
  'space-between'?: string | number;
  'thumbs-swiper'?: string;
  'free-mode'?: string | boolean;
  'watch-slides-progress'?: string | boolean;
  direction?: string;
  class?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type SwiperSlideProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  class?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': SwiperContainerProps;
      'swiper-slide': SwiperSlideProps;
    }
  }
}

export {};
