import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

type SwiperContainerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  init?: string | boolean;
  navigation?: string | boolean;
  pagination?: string | boolean;
  scrollbar?: string | boolean;
  class?: string;
  children?: ReactNode;
};

type SwiperSlideProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  class?: string;
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
