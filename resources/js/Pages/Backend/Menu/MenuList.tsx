import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import DeleteMenuItem from '../MenuItem/DeleteMenuItem';
import EditMenuItem from '../MenuItem/EditMenuItem';

export default function MenuItemsList({
  firstLevelMenuItems,
  menuItems,
  ...rest
}) {
  const [editMenuItem, setEditMenuItem] = useState(false);
  const [deleteMenuItem, setDeleteMenuItem] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const handleEditMenuItem = (e, id) => {
    e.preventDefault();
    const newMenuItem = menuItems.filter(MenuItem => MenuItem.id === id)[0];
    setMenuItem(newMenuItem);
    setEditMenuItem(!editMenuItem);
  };

  const handleDeleteMenuItem = (e, id) => {
    e.preventDefault();
    const newMenuItem = menuItems.filter(MenuItem => MenuItem.id === id)[0];
    setMenuItem(newMenuItem);
    setDeleteMenuItem(!deleteMenuItem);
  };
  return (
    <>
      {menuItem && editMenuItem && (
        <EditMenuItem
          isOpen={editMenuItem}
          onClose={setEditMenuItem}
          item={menuItem}
          setMenuItem={setMenuItem}
          menuItems={menuItems}
        />
      )}
      {menuItem && deleteMenuItem && (
        <DeleteMenuItem
          isOpen={deleteMenuItem}
          onClose={setDeleteMenuItem}
          item={menuItem}
          setMenuItem={setMenuItem}
        />
      )}

      <div className={cn('space-y-4', rest.className)}>
        {firstLevelMenuItems?.map(item => {
          return (
            <Accordion
              type="single"
              key={item.name}
              collapsible
              className="w-full"
            >
              <AccordionItem value={item.name}>
                <div className="flex items-center justify-between gap-4">
                  <p>
                    {item.order}. {item.name}
                  </p>
                  <div className="ml-auto">
                    {item.children && item.children.length > 0 && (
                      <AccordionTrigger>{'Submenu items'}</AccordionTrigger>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Actions</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={e => handleEditMenuItem(e, item.id)}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={e => {
                          handleDeleteMenuItem(e, item.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {item.children && item.children.length > 0 && (
                  <AccordionContent>
                    <MenuItemsList
                      firstLevelMenuItems={item.children}
                      menuItems={menuItems}
                      className="border-text-foreground ml-1 mt-4 border-l px-4"
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </>
  );
}
