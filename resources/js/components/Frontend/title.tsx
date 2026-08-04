import { FadeText } from '../shared/FadeText';
import { cn } from '@/lib/utils';

const Title = ({ title = undefined, underlineStyles = undefined }: any) => {
  return (
    <div className="relative mb-8 md:mb-10">
      <FadeText
        text={title}
        className="flex items-center text-xl font-bold tracking-tight text-primary md:text-2xl lg:text-3xl xl:text-4xl"
      >
        {title}
      </FadeText>
      <div
        className={cn(
          'mt-2 h-1 w-14 bg-gradient-to-l from-theme-50 to-theme-300 dark:from-theme-300 dark:to-theme-500 md:h-1.5 md:w-16',
          underlineStyles
        )}
      />
    </div>
  );
};

export default Title;
