import { FadeText } from '../shared/FadeText';
import { cn } from '@/lib/utils';

type TitleProps = {
  title?: string;
  underlineStyles?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
};

const Title = ({ title, underlineStyles, as: Tag = 'h2' }: TitleProps) => {
  if (!title) {
    return null;
  }

  return (
    <div className="relative mb-8 md:mb-10">
      <Tag className="text-primary flex items-center font-serif text-xl font-bold tracking-tight md:text-2xl lg:text-3xl xl:text-4xl">
        <FadeText text={title} className="block" />
      </Tag>
      <div
        className={cn(
          'from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 mt-2 h-1 w-14 bg-linear-to-l md:h-1.5 md:w-16',
          underlineStyles
        )}
        aria-hidden
      />
    </div>
  );
};

export default Title;
