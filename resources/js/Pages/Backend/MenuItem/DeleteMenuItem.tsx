import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

export default function DeleteMenuItem({ isOpen, onClose, item, setMenuItem }) {
  const { delete: destroy, processing } = useForm();
  const { toast } = useToast();
  const submit = e => {
    e.preventDefault();
    destroy(route('admin.deleteMenuItem.menu', item.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu Item deleted.',
          description: 'Menu Item deleted Successfully',
        });
        setMenuItem(null);
        onClose(!isOpen);
      },
      onError: () => console.log('Error while deleting'),
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Menu item</DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div
            class="mb-4 border-l-4 border-orange-500 bg-orange-100 p-4 text-orange-700"
            role="alert"
          >
            <p class="font-bold">Be Warned</p>
            <p>
              {item.children.length > 0
                ? 'This menu item has sub items. All sub items will also be deleted. Are you sure you want to delete'
                : 'Are you sure you want to delete this menu item ?'}
            </p>
          </div>

          <DialogFooter>
            <PrimaryButton type="submit" isLoading={processing}>
              Delete
            </PrimaryButton>
            <Button
              variant="ghost"
              onClick={() => {
                onClose(!isOpen);
                setMenuItem(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
