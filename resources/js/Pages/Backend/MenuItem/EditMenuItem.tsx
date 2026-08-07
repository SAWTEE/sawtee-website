import { useForm } from '@inertiajs/react';

import FormField from '@/components/Backend/FormField';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toastFormErrors } from '@/lib/form-errors';

export default function EditMenuItem({
  isOpen = undefined,
  onClose = undefined,
  item = undefined,
  setMenuItem = undefined,
  menuItems = undefined,
}: any) {
  const { data, setData, patch, processing, errors } = useForm({
    title: item.title,
    name: item.name,
    menu_id: item.menu_id,
    url: item.url,
    order: item.order,
    parent_id: item.parent_id || '',
  });
  const { toast } = useToast();

  // @ts-ignore allowlist-migration
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
        onClose(!isOpen);
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Menu item</DialogTitle>
          <DialogDescription>
            Make changes to the menu item here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 py-4">
            <FormField id="title" label="Title" error={errors.title}>
              {field => (
                <Input
                  {...field}
                  name="title"
                  value={data.title}
                  className="col-span-3"
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>
            <FormField id="name" label="Name" error={errors.name}>
              {field => (
                <Input
                  {...field}
                  name="name"
                  value={data.name}
                  className="col-span-3"
                  onChange={e => setData('name', e.target.value)}
                />
              )}
            </FormField>
            <FormField id="url" label="URL" error={errors.url}>
              {field => (
                <Input
                  {...field}
                  name="url"
                  value={data.url}
                  className="col-span-3"
                  onChange={e => setData('url', e.target.value)}
                />
              )}
            </FormField>
            <FormField id="order" label="Order" error={errors.order}>
              {field => (
                <Input
                  {...field}
                  type="number"
                  name="order"
                  value={data.order}
                  className="col-span-3"
                  onChange={e => setData('order', e.target.value)}
                />
              )}
            </FormField>
            <FormField
              id="parent_id"
              label="Select parent"
              error={errors.parent_id}
            >
              {field => (
                <Select
                  name="parent_id"
                  value={data.parent_id}
                  onValueChange={value => setData('parent_id', value)}
                >
                  <SelectTrigger
                    id={field.id}
                    aria-invalid={field['aria-invalid']}
                    aria-describedby={field['aria-describedby']}
                  >
                    <SelectValue placeholder="Select parent menu item" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Menu Items</SelectLabel>
                      {menuItems.map(
                        // @ts-ignore allowlist-migration
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
              )}
            </FormField>
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
