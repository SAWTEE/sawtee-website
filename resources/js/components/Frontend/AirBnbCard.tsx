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
          className="border-theme-600/12 dark:border-theme-600/25 h-auto max-h-64 w-full overflow-hidden rounded-md border"
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
    <div className="border-theme-600/12 dark:border-theme-600/25 w-full overflow-hidden rounded-md border">
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
