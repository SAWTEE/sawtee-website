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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';

export default function EditMenuItem({
  isOpen,
  onClose,
  item,
  setMenuItem,
  menuItems,
}) {
  const { data, setData, patch, processing, reset } = useForm({
    title: item.title,
    name: item.name,
    menu_id: item.menu_id,
    url: item.url,
    order: item.order,
    parent_id: item.parent_id || '',
  });
  const { toast } = useToast();

  const submit = e => {
    e.preventDefault();

    patch(route('admin.editMenuItem.menu', item.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu Item Updated.',
          description: 'Menu Item Updated Successfully',
        });
        setMenuItem(null);
        reset();
        onClose(!isOpen);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Menu item</DialogTitle>
          <DialogDescription>
            Make changes to the menu item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            <div className="">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                value={data.title}
                className="col-span-3"
                onChange={e => setData('title', e.target.value)}
              />
            </div>
            <div className="">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                id="name"
                value={data.name}
                className="col-span-3"
                onChange={e => setData('name', e.target.value)}
              />
            </div>
            <div className="">
              <Label htmlFor="url">URL</Label>
              <Input
                name="url"
                id="url"
                value={data.url}
                className="col-span-3"
                onChange={e => setData('url', e.target.value)}
              />
            </div>
            <div className="">
              <Label htmlFor="order">Order</Label>
              <Input
                type="number"
                name="order"
                id="order"
                value={data.order}
                className="col-span-3"
                onChange={e => setData('order', e.target.value)}
              />
            </div>
            <div className="">
              <Label htmlFor="parent_id">Select parent</Label>
              <Select
                name="parent_id"
                id="parent_id"
                placeholder="Select parent menu item"
                value={data.parent_id}
                className="col-span-3"
                onChange={e => setData('parent_id', e.target.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent menu item" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Menu Items</SelectLabel>
                    {menuItems.map(
                      menuItem =>
                        menuItem.id !== item.id && (
                          <SelectItem key={menuItem.id} value={menuItem.id}>
                            {menuItem.title}
                          </SelectItem>
                        )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton type="submit" isLoading={processing}>
              Save
            </PrimaryButton>
            <Button variant="ghost" onClick={() => onClose(!isOpen)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
