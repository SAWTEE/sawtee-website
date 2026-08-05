import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  title?: ReactNode;
  dark?: boolean | string | number;
  py?: unknown;
  px?: unknown;
};

const Section = ({ className, children, ..._rest }: SectionProps) => (
  <section className={cn('mx-auto max-w-5xl', className)}>{children}</section>
);

export default Section;
