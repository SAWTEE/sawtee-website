import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const MapModel = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
          <DialogDescription>
            View SAWTEE's location in google maps.
          </DialogDescription>
        </DialogHeader>
        <DialogClose />
        <div className="w-full">
          <iframe
            src={
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8576852768524!2d85.329329!3d27.72168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1913dfb0b0b3%3A0x4d5d3519d24d3c38!2sSouth%20Asia%20Watch%20on%20Trade%2C%20Economics%20and%20Environment%20(SAWTEE)!5e0!3m2!1sen!2snp!4v1700216228197!5m2!1sen!2snp'
            }
            className="aspect-video w-full rounded-md"
            width="100%"
            allowFullScreen="true"
            loading="lazy"
            title="sawtee location map"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
