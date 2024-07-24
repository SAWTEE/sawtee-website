import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

const FeaturedMedia = ({ src, srcSet, alt, className }) => {
  return (
    <picutre>
      <img
        className={cn(
          "relative w-full h-full object-cover aspect-video",
          className,
        )}
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1200px) 50vw,100vw"
        alt={alt || "Hero Image"}
        loading="lazy"
      />
    </picutre>
  );
};

export default FeaturedMedia;
