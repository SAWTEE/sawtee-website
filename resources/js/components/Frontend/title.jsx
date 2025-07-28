import { FadeText } from '../shared/FadeText';
import { cn } from '@/lib/utils';

const Title = ({ title, underlineStyles }) => {
  return (
    <div className="relative mb-12">
      <FadeText
        text={title}
        className="flex items-center text-xl font-bold text-primary md:text-2xl lg:text-3xl xl:text-4xl"
      >
        {title}
      </FadeText>
      <div
        className={cn(
          'h-2 w-[10%] bg-gradient-to-l from-theme-50 to-theme-300 dark:bg-gradient-to-l dark:from-theme-300 dark:to-theme-500',
          underlineStyles
        )}
      />
    </div>
  );
};

export default Title;
