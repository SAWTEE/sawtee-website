import { cn } from '@/lib/utils';

/**
 * @param {React.ComponentProps<typeof Box>} props
 */
const Section = ({ className, children }) => (
  <section className={cn('mx-auto max-w-5xl', className)}>{children}</section>
);
export default Section;
