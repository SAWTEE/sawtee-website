import { memberInstituteLogos } from '@/lib/member-institute-logos';
import { cn } from '@/lib/utils';

type MemberInstitutesMarqueeProps = {
  className?: string;
};

function InstituteMark({
  short_label,
  member_name,
  member_website_link,
  logo,
  decorative = false,
}: (typeof memberInstituteLogos)[number] & { decorative?: boolean }) {
  return (
    <a
      href={member_website_link}
      target="_blank"
      rel="noopener noreferrer"
      title={decorative ? undefined : member_name}
      aria-label={decorative ? undefined : member_name}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className="group text-secondary-foreground hover:text-primary mx-5 flex h-16 w-36 shrink-0 items-center justify-center opacity-80 transition-opacity hover:opacity-100 md:mx-8 md:h-20 md:w-40"
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className="max-h-12 max-w-full object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0 md:max-h-14 dark:brightness-110"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="font-serif text-sm font-semibold tracking-wide md:text-base">
          {short_label}
        </span>
      )}
    </a>
  );
}

/**
 * Slow infinite CSS marquee of member-institution logos / text fallbacks.
 * Uses existing `animate-marquee` (translateX -50% over duplicated track).
 */
export default function MemberInstitutesMarquee({
  className,
}: MemberInstitutesMarqueeProps) {
  return (
    <div
      className={cn(
        'border-borderColor/60 relative mt-10 overflow-hidden border-y py-6',
        className
      )}
      aria-label="Member institution logos"
    >
      <div
        className="from-bodyBackground dark:from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent md:w-20"
        aria-hidden
      />
      <div
        className="from-bodyBackground dark:from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent md:w-20"
        aria-hidden
      />

      <div
        className="animate-marquee flex w-max motion-reduce:animate-none"
        style={{ ['--duration' as string]: '45s' }}
      >
        <div className="flex items-center">
          {memberInstituteLogos.map(inst => (
            <InstituteMark key={inst.slug} {...inst} />
          ))}
        </div>
        <div className="flex items-center" aria-hidden>
          {memberInstituteLogos.map(inst => (
            <InstituteMark key={`${inst.slug}-dup`} {...inst} decorative />
          ))}
        </div>
      </div>
    </div>
  );
}
