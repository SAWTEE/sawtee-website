export type MediaLike = {
  collection_name?: string;
  original_url?: string;
  preview_url?: string;
  srcset?: string | null;
  placeholder?: string | null;
};

export type MediaImage = {
  src: string;
  srcSet?: string | null;
  placeholder?: string | null;
};

/**
 * Flatten a media collection into the props `<ResponsiveImage>` expects.
 *
 * Prefer the small preview on thumbs. Heroes use the conversion URL the
 * backend already put on `original_url`, plus Spatie's width-descriptor
 * srcset and the tiny placeholder for slow networks.
 */
export function mediaImage(
  media: MediaLike[] | undefined,
  collection: string | undefined,
  fallback: string,
  preferPreview = false
): MediaImage {
  const item = collection
    ? media?.find(mediaItem => mediaItem.collection_name === collection)
    : media?.[0];

  if (!item) {
    return { src: fallback };
  }

  const src = preferPreview
    ? (item.preview_url ?? item.original_url ?? fallback)
    : (item.original_url ?? item.preview_url ?? fallback);

  return {
    src,
    srcSet: item.srcset ?? null,
    placeholder: item.placeholder ?? null,
  };
}
