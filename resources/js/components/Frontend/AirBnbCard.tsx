import ZoomableImage from '@/components/Frontend/ZoomableImage';

type AirBnbCardProps = {
  img?: string[] | null;
  title?: string;
  mediaSrc?: string | null;
};

export default function AirBnbCard({
  img = null,
  title = 'media fellowship',
  mediaSrc = null,
}: AirBnbCardProps) {
  return img && img.length > 0 ? (
    img.map(image_src => {
      return (
        <div
          key={image_src}
          className="h-auto max-h-64 w-full overflow-hidden rounded-md border border-[#006181]/12 dark:border-[#006181]/25"
        >
          <ZoomableImage
            className="h-full w-full max-w-full object-cover"
            src={image_src}
            alt={title}
          />
        </div>
      );
    })
  ) : (
    <div className="w-full overflow-hidden rounded-md border border-[#006181]/12 dark:border-[#006181]/25">
      <iframe
        className="aspect-video w-full"
        src={mediaSrc ?? undefined}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
