import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeftIcon,
  MoreHorizontal,
  RotateCcwIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const forceDeleteDescription =
  'This permanently deletes the post and removes associated media and files. This cannot be undone.';

export default function Trash({ auth = undefined, posts = undefined }: any) {
  const { toast } = useToast();
  const [pendingBulkIds, setPendingBulkIds] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<'restore' | 'force' | null>(
    null
  );
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkClearSelection, setBulkClearSelection] = useState<
    (() => void) | null
  >(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const handleRestore = (e: any, id: number) => {
    e.preventDefault();
    router.post(
      route('admin.posts.restore', id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: 'Post restored',
            description: `Post ID:${id} restored from trash`,
          });
        },
      }
    );
  };

  const handleForceDelete = (e: any, id: number) => {
    e.preventDefault();
    router.delete(route('admin.posts.force-destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Post permanently deleted',
          description: `Post ID:${id} and associated media removed`,
        });
      },
    });
  };

  const confirmBulkAction = () => {
    if (pendingBulkIds.length === 0 || !bulkAction) {
      return;
    }

    setBulkProcessing(true);

    const onSuccess = () => {
      toast({
        title:
          bulkAction === 'restore'
            ? 'Posts restored'
            : 'Posts permanently deleted',
        description:
          bulkAction === 'restore'
            ? `${pendingBulkIds.length} post(s) restored from trash`
            : `${pendingBulkIds.length} post(s) and associated media permanently removed`,
      });
      bulkClearSelection?.();
      setPendingBulkIds([]);
      setBulkDialogOpen(false);
      setBulkAction(null);
    };

    if (bulkAction === 'restore') {
      router.post(
        route('admin.posts.batch-restore'),
        { ids: pendingBulkIds },
        {
          preserveScroll: true,
          onSuccess,
          onFinish: () => setBulkProcessing(false),
        }
      );
    } else {
      router.delete(route('admin.posts.batch-force-destroy'), {
        data: { ids: pendingBulkIds },
        preserveScroll: true,
        onSuccess,
        onFinish: () => setBulkProcessing(false),
      });
    }
  };

  const openBulkDialog = (
    action: 'restore' | 'force',
    selectedIds: number[],
    clearSelection: () => void
  ) => {
    setBulkAction(action);
    setPendingBulkIds(selectedIds);
    setBulkClearSelection(() => clearSelection);
    setBulkDialogOpen(true);
  };

  const defaultColumns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mx-4"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mx-4"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => row.original.category?.name ?? 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => row.original.status,
    },
    {
      accessorKey: 'deleted_at',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Deleted" />
      ),
      cell: ({ row }: any) => {
        const value = row.original.deleted_at;
        if (!value) {
          return '—';
        }

        return new Date(value).toLocaleString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const id = row.original.id;

        return (
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Permanently delete this post?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {forceDeleteDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: 'destructive' }))}
                  onClick={e => handleForceDelete(e, id)}
                >
                  Delete permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
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
                <DropdownMenuItem onClick={e => handleRestore(e, id)}>
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete permanently
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </AlertDialog>
        );
      },
      enableHiding: false,
    },
  ];

  return (
    <>
      <Head title="Posts Trash" />

      <div className="mb-4 flex items-center gap-3">
        <Link href={route('admin.posts.index')}>
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
      </div>

      <DataTable
        defaultColumns={defaultColumns}
        data={posts}
        showTypeFilter={false}
        bulkActions={({ selectedIds, selectedCount, clearSelection }: any) => (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                openBulkDialog('restore', selectedIds, clearSelection)
              }
            >
              <RotateCcwIcon className="mr-2 h-4 w-4" />
              Restore selected ({selectedCount})
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                openBulkDialog('force', selectedIds, clearSelection)
              }
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete permanently ({selectedCount})
            </Button>
          </div>
        )}
      />

      <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'restore'
                ? `Restore ${pendingBulkIds.length} post(s)?`
                : `Permanently delete ${pendingBulkIds.length} post(s)?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === 'restore'
                ? 'Selected posts will be restored and appear again in the posts list.'
                : forceDeleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                buttonVariants({
                  variant: bulkAction === 'force' ? 'destructive' : 'default',
                })
              )}
              disabled={bulkProcessing}
              onClick={e => {
                e.preventDefault();
                confirmBulkAction();
              }}
            >
              {bulkProcessing
                ? bulkAction === 'restore'
                  ? 'Restoring…'
                  : 'Deleting…'
                : bulkAction === 'restore'
                  ? 'Restore'
                  : 'Delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
