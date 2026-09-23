import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SITE_COPY_DEFAULTS } from '@/lib/site-copy';

export const MapModel = ({
  isOpen = undefined,
  onOpenChange = undefined,
  title = SITE_COPY_DEFAULTS.footer.map_title,
  description = SITE_COPY_DEFAULTS.footer.map_description,
  embedUrl = SITE_COPY_DEFAULTS.footer.map_embed_url,
  iframeTitle = SITE_COPY_DEFAULTS.footer.map_iframe_title,
}: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogClose />
        <div className="w-full">
          <iframe
            src={embedUrl}
            className="aspect-video w-full rounded-md"
            width="100%"
            // @ts-ignore allowlist-migration
            allowFullScreen="true"
            loading="lazy"
            title={iframeTitle}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
