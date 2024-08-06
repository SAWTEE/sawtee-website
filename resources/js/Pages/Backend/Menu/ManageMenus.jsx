
import AuthenticatedLayout from '@/components/Layouts/AuthenticatedLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SelectTrigger } from '@/components/ui/select';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { slugify } from '@/lib/helpers';
import {
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  List,
  ListItem,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import MenuItemsList from './MenuList';
import EditMenuForm from './Partials/EditMenu';

export default function ManageMenu({
  auth,
  categories,
  sections,
  menus,
  pages,
  desiredMenu,
  menuItems,
}) {
  //   const editMenu = useDisclosure();
  const [firstLevelMenuItems, setFirstLevelMenuItems] = useState(null);
  const { get } = useForm();
  const [editMenu, setEditMenu] = useState(false);
  const { toast } = useToast();

  const handleMenuSlected = (e, id) => {
    e.preventDefault();
    get(route('admin.manage.menus', id));
  };

  useEffect(() => {
    const newMenuItems = [];
    menuItems
      .toSorted((a, b) => a.order - b.order)
      ?.map(menuItem => {
        if (!menuItem.parent_id) {
          newMenuItems.push(menuItem);
        }
      });
    setFirstLevelMenuItems(newMenuItems);
  }, [menuItems]);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Menus" />

      {editMenu && (
        <EditMenuForm
          open={editMenu}
          setOpen={setEditMenu}
          menu={desiredMenu}
        />
      )}

      {menus.length > 0 && (
        <div className="flex space-x-4 mb-4 max-w-xl">
          <Select
            placeholder="Select menu to edit"
            value={desiredMenu.id}
            onValueChange={value => handleMenuSlected(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select menu to edit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Menus</SelectLabel>
                {menus.map(menu => (
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

      <div className="grid md:gird-cols-2 lg:grid-cols-[400px_auto] gap-8 grid-rows-auto">
        <div className="col-span-1">
          <div className="py-2 px-6 bg-secondary text-secondary-foreground rounded-md">
            Add Menu Items
          </div>
          {desiredMenu && (
            <div className="p-6 mt-6 shadow-md rounded-lg space-y-4">
              <AddToMenu
                options={categories}
                name="categories"
                menu={desiredMenu}
                menuItems={menuItems}
              />

              <AddToMenu
                options={pages}
                name="pages"
                menu={desiredMenu}
                menuItems={menuItems}
              />

              <AddToMenu
                options={sections}
                name="sections"
                menu={desiredMenu}
                pages={pages}
                menuItems={menuItems}
              />

              <AddToMenu
                name="custom link"
                menu={desiredMenu}
                menuItems={menuItems}
              />
            </div>
          )}
        </div>
        <div className="col-span-1">
          <div className="py-2 px-6 bg-secondary text-secondary-foreground rounded-md">
            Menu Structure
          </div>
          <MenuStructure
            firstLevelMenuItems={firstLevelMenuItems}
            menuItems={menuItems}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

const AddToMenu = ({ options, name, menu, menuItems }) => {
  const [selectedData, setSelectedData] = useState(null);
  const [parent, setParent] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    menu_id: menu.id,
    title: '',
    name: '',
    url: '',
    order: '',
    parent_id: '',
  });
  const toast = useToast();

  function handleSelected(selected) {
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
      order: menuItems.filter(menuItem => !menuItem.parent_id).length + 1,
      url: url,
    });
  }

  const addToMenu = e => {
    e.preventDefault();

    post(route('admin.addMenuItems.menu'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          position: 'top-right',
          title: 'Menu Created.',
          description: 'Menu Created Successfully',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });

        reset('name', 'title', 'order', 'parent_id', 'url');
      },
      onError: errors => {
        console.error(errors);
      },
    });
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={name}>
        <AccordionTrigger>Add {name}</AccordionTrigger>

        <AccordionContent>
          <div className={'space-y-4'}>
            {options && (
              <div>
                <Label htmlFor={name}>Select {name}</Label>
                <Select
                  name={name}
                  id={name}
                  placeholder={`Select ${name}`}
                  value={selectedData ? selectedData.id : ''}
                  onValueChange={value => {
                    const selected = options.filter(
                      option => option.id === Number(value)
                    )[0];
                    setSelectedData(selected);
                    handleSelected(selected);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select {name}</SelectLabel>
                    </SelectGroup>
                    {options?.map(option => {
                      return (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name || option.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
              {errors.title && <InputError mt={2}>{errors.title}</InputError>}
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <InputError mt={2}>{errors.name}</InputError>}
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                name="url"
                id="url"
                value={data.url}
                onChange={e => setData('url', e.target.value)}
              />
              {errors.url && <InputError mt={2}>{errors.url}</InputError>}
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                type="number"
                name="order"
                id="order"
                value={data.order}
                onChange={e => setData('order', e.target.value)}
              />
              {errors.order && <InputError mt={2}>{errors.order}</InputError>}
            </div>
            <div>
              <Label htmlFor="parent_id">Select parent menu item</Label>
              <Select
                name="parent_id"
                id="parent_id"
                placeholder="Select parent"
                value={data.parent_id}
                onChange={e => {
                  const order =
                    menuItems.filter(
                      menuItem => menuItem.id === Number(e.target.value)
                    )[0].children.length + 1;
                  setData({
                    ...data,
                    order: order,
                    parent_id: e.target.value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select parent</SelectLabel>

                    {menuItems?.map(menuItem => (
                      <SelectItem key={menuItem.id} value={menuItem.id}>
                        {menuItem.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.parent_id && (
                <InputError mt={2}>{errors.parent_id}</InputError>
              )}
            </div>

            <Button
              isLoading={processing}
              onClick={e => {
                addToMenu(e);
                setSelectedData(null);
                setParent(null);
              }}
            >
              Add to Menu
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const MenuStructure = ({ firstLevelMenuItems, menuItems }) => {
  return (
    <div className="p-6 mt-6 shadow-md rounded-lg">
      {firstLevelMenuItems && firstLevelMenuItems.length > 0 && (
        <MenuItemsList
          firstLevelMenuItems={firstLevelMenuItems}
          menuItems={menuItems}
        />
      )}
    </div>
  );
};


