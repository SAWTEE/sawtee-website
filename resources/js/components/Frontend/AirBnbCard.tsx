import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function AirBnbCard({
  img,
  title = 'media fellowship',
  mediaSrc,
}) {
  return img.length > 0 ? (
    img.map(image_src => {
      return (
        <div key={image_src} className="h-auto max-h-64 w-full overflow-hidden">
          <Zoom>
            <img
              className="h-full w-full max-w-full rounded-lg object-cover"
              src={image_src}
              alt={title}
              loading="lazy"
            />
          </Zoom>
        </div>
      );
    })
  ) : (
    <div className="w-full">
      <iframe
        width="673"
        height="489"
        src={mediaSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  );
}
