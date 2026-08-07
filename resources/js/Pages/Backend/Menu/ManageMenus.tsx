import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import FormField from '@/components/Backend/FormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
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
import { slugify } from '@/lib/helpers';

import MenuItemsList from './MenuList';
import EditMenuForm from './Partials/EditMenu';

export default function ManageMenu({
  auth = undefined,
  categories = undefined,
  sections = undefined,
  menus = undefined,
  pages = undefined,
  desiredMenu = undefined,
  menuItems = undefined,
}: any) {
  const [firstLevelMenuItems, setFirstLevelMenuItems] = useState(null);
  const { get } = useForm();
  const [editMenu, setEditMenu] = useState(false);
  const [menu, setMenu] = useState(desiredMenu);

  // @ts-ignore allowlist-migration
  const handleMenuSlected = id => {
    get(route('admin.manage.menus', id));
    // @ts-ignore allowlist-migration
    setMenu(menus.find(menu => menu.id === id));
  };

  useEffect(() => {
    // @ts-ignore allowlist-migration
    const newMenuItems = [];
    menuItems
      .toSorted((a: any, b: any) => a.order - b.order)
      ?.map((menuItem: any) => {
        if (!menuItem.parent_id) {
          newMenuItems.push(menuItem);
        }
      });
    // @ts-ignore allowlist-migration
    setFirstLevelMenuItems(newMenuItems);
  }, [menuItems]);

  return (
    <>
      <Head title="Manage Menus" />

      {editMenu && (
        <EditMenuForm open={editMenu} setOpen={setEditMenu} menu={menu} />
      )}

      {menus.length > 0 && (
        <div className="mb-4 flex max-w-xl space-x-4">
          <Select
            // @ts-ignore allowlist-migration
            placeholder="Select menu to edit"
            value={menu.id}
            onValueChange={value => handleMenuSlected(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select menu to edit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Menus</SelectLabel>
                {menus.map((menu: any) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => setEditMenu(true)}>Edit selected menu</Button>
        </div>
      )}

      <div className="md:gird-cols-2 grid-rows-auto grid gap-8 lg:grid-cols-[400px_auto]">
        <div className="col-span-1">
          <div className="bg-secondary text-secondary-foreground rounded-md px-6 py-2">
            Add Menu Items
          </div>
          {menu && (
            <div className="mt-6 space-y-4 rounded-lg p-6 shadow-md">
              <AddToMenu
                options={categories}
                name="categories"
                menu={menu}
                menuItems={menuItems}
              />

              <AddToMenu
                options={pages}
                name="pages"
                menu={menu}
                menuItems={menuItems}
              />

              <AddToMenu
                options={sections}
                name="sections"
                menu={menu}
                pages={pages}
                menuItems={menuItems}
              />

              <AddToMenu name="custom link" menu={menu} menuItems={menuItems} />
            </div>
          )}
        </div>
        <div className="col-span-1">
          <div className="bg-secondary text-secondary-foreground rounded-md px-6 py-2">
            Menu Structure
          </div>
          <MenuStructure
            firstLevelMenuItems={firstLevelMenuItems}
            menuItems={menuItems}
          />
        </div>
      </div>
    </>
  );
}

const AddToMenu = ({
  options = undefined,
  name = undefined,
  menu = undefined,
  menuItems = undefined,
}: any) => {
  const [selectedData, setSelectedData] = useState(null);
  const [, setParent] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    menu_id: menu.id,
    title: '',
    name: '',
    url: '',
    order: '',
    parent_id: '',
  });
  const { toast } = useToast();

  function handleSelected(selected: any) {
    let url = '';
    switch (name) {
      case 'pages':
        url = `/${selected.slug}`;
        break;
      case 'sections': {
        const slug = slugify(selected.title);
        url = `/#${slug}`;
        break;
      }
      case 'categories':
        url = selected.parent
          ? `/category/${selected.parent.slug}/${selected.slug}`
          : `/category/${selected.slug}`;
        break;
      default:
        url = `/${selected.slug}`;
    }

    setData({
      ...data,
      title: selected.name || selected.title,
      name: selected.name || selected.title,
      order:
        menuItems.filter((menuItem: any) => !menuItem.parent_id).length + 1,
      url: url,
    });
  }

  // @ts-ignore allowlist-migration
  const addToMenu = e => {
    e.preventDefault();

    post(route('admin.addMenuItems.menu'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Menu Created.',
          description: 'Menu Created Successfully',
        });

        reset();
      },
      onError: errors => toastFormErrors(errors, toast),
    });
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={name}>
        <AccordionTrigger>Add {name}</AccordionTrigger>

        <AccordionContent>
          <form
            className="space-y-4"
            noValidate
            onSubmit={e => {
              addToMenu(e);
              setSelectedData(null);
              setParent(null);
            }}
          >
            {options && (
              <FormField id={name} label={`Select ${name}`}>
                {field => (
                  <Select
                    name={name}
                    // @ts-ignore allowlist-migration
                    value={selectedData ? selectedData.id : ''}
                    onValueChange={value => {
                      const selected = options.filter(
                        // @ts-ignore allowlist-migration
                        option => option.id === Number(value)
                      )[0];
                      setSelectedData(selected);
                      handleSelected(selected);
                    }}
                  >
                    <SelectTrigger
                      id={field.id}
                      aria-invalid={field['aria-invalid']}
                      aria-describedby={field['aria-describedby']}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select {name}</SelectLabel>
                      </SelectGroup>
                      {options?.map((option: any) => {
                        return (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name || option.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            )}

            <FormField id={`${name}-title`} label="Title" error={errors.title}>
              {field => (
                <Input
                  {...field}
                  name="title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                />
              )}
            </FormField>

            <FormField id={`${name}-name`} label="Name" error={errors.name}>
              {field => (
                <Input
                  {...field}
                  name="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                />
              )}
            </FormField>

            <FormField id={`${name}-url`} label="URL" error={errors.url}>
              {field => (
                <Input
                  {...field}
                  name="url"
                  value={data.url}
                  onChange={e => setData('url', e.target.value)}
                />
              )}
            </FormField>

            <FormField id={`${name}-order`} label="Order" error={errors.order}>
              {field => (
                <Input
                  {...field}
                  type="number"
                  name="order"
                  value={data.order}
                  onChange={e => setData('order', e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id={`${name}-parent_id`}
              label="Select parent menu item"
              error={errors.parent_id}
            >
              {field => (
                <Select
                  name="parent_id"
                  value={data.parent_id}
                  onValueChange={value => {
                    const order =
                      menuItems.filter(
                        // @ts-ignore allowlist-migration
                        menuItem => menuItem.id === Number(value)
                      )[0].children.length + 1;
                    setData({
                      ...data,
                      order: order,
                      parent_id: value,
                    });
                  }}
                >
                  <SelectTrigger
                    id={field.id}
                    aria-invalid={field['aria-invalid']}
                    aria-describedby={field['aria-describedby']}
                  >
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select parent</SelectLabel>

                      {menuItems?.map((menuItem: any) => (
                        <SelectItem key={menuItem.id} value={menuItem.id}>
                          {menuItem.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <Button type="submit" disabled={processing}>
              Add to Menu
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const MenuStructure = ({
  firstLevelMenuItems = undefined,
  menuItems = undefined,
}: any) => {
  return (
    <div className="mt-6 rounded-lg p-6 shadow-md">
      {firstLevelMenuItems && firstLevelMenuItems.length > 0 && (
        <MenuItemsList
          firstLevelMenuItems={firstLevelMenuItems}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};
