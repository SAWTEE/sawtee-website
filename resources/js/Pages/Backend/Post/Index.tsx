import { Head, Link, router, useForm } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import DataTableActions from '@/components/Backend/DataTableActions';
import { DataTableColumnHeader } from '@/components/Backend/DatatableColumnHelper';
import { DataTable } from '@/components/Backend/FrontDataTable';
import PrimaryButton from '@/components/Backend/PrimaryButton';
import TWTags from '@/components/shared/TWTags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const softDeleteDescription =
  'This will move the post to the trash. Associated media is kept until the post is permanently deleted.';

export default function Index({
  auth: _auth = undefined,
  posts = undefined,
  categories = undefined,
  categoryID = undefined,
}: any) {
  const { get, delete: destroy } = useForm();
  const { toast } = useToast();
  const [pendingBulkIds, setPendingBulkIds] = useState<number[]>([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkClearSelection, setBulkClearSelection] = useState<
    (() => void) | null
  >(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const handleDelete = (e: any, id: any) => {
    e.preventDefault();
    destroy(route('admin.posts.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      invalidateCacheTags: ['admin-nav', 'posts'],
      onSuccess: () => {
        toast({
          title: 'Post deleted',
          description: `Post ID:${id} moved to trash`,
        });
      },
    });
  };

  const confirmBulkDelete = () => {
    if (pendingBulkIds.length === 0) {
      return;
    }

    setBulkProcessing(true);
    router.delete(route('admin.posts.batch-destroy'), {
      data: { ids: pendingBulkIds },
      preserveScroll: true,
      invalidateCacheTags: ['admin-nav', 'posts'],
      onSuccess: () => {
        toast({
          title: 'Posts deleted',
          description: `${pendingBulkIds.length} post(s) moved to trash`,
        });
        bulkClearSelection?.();
        setPendingBulkIds([]);
        setBulkDialogOpen(false);
      },
      onFinish: () => setBulkProcessing(false),
    });
  };

  const Status = ({ status = undefined }: any) => {
    switch (status) {
      case 'unpublished':
        return (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-500/10 ring-inset">
            {status}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-500/10 ring-inset">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-green-500/10 ring-inset">
            {status}
          </span>
        );
    }
  };

  // @ts-ignore allowlist-migration
  const handleEdit = (e, post_id, category_id) => {
    e.preventDefault();
    get(route('admin.posts.edit', post_id, category_id));
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
      accessorKey: 'theme',
      header: 'Theme',
      cell: ({ row }: any) => {
        return row.original.theme ? row.original.theme.title : 'N/A';
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }: any) => {
        return row.original.tags?.map((tag: any) => (
          <TWTags key={tag.id} colorScheme="blue" className="ml-2">
            {tag.name}
          </TWTags>
        ));
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        return <Status status={row.original.status} />;
      },
    },
    {
      accessorKey: 'author',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }: any) => {
        return (
          <DataTableActions
            id={row.original.id}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            deleteTitle="Move post to trash?"
            deleteDescription={softDeleteDescription}
          />
        );
      },
      enableHiding: false,
    },
  ];

  return (
    <>
      <Head title="Posts" />

      <div className="flex items-center gap-3">
        <Link href={route('admin.posts.create')}>
          <PrimaryButton>Create New Post</PrimaryButton>
        </Link>
        <Link href={route('admin.posts.trash')}>
          <Button variant="outline">
            <Trash2Icon className="mr-2 h-4 w-4" />
            Trash
          </Button>
        </Link>
      </div>
      <DataTable
        defaultColumns={defaultColumns}
        data={posts}
        showTypeFilter={true}
        typeFilterOptions={{
          iterable: categories,
          selectedId: categoryID,
          route: '/admin/posts',
          only: ['posts', 'categories', 'categoryID'],
        }}
        bulkActions={({ selectedIds, selectedCount, clearSelection }: any) => (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              setPendingBulkIds(selectedIds);
              setBulkClearSelection(() => clearSelection);
              setBulkDialogOpen(true);
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete selected ({selectedCount})
          </Button>
        )}
      />

      <AlertDialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Move {pendingBulkIds.length} post(s) to trash?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {softDeleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'destructive' }))}
              disabled={bulkProcessing}
              onClick={e => {
                e.preventDefault();
                confirmBulkDelete();
              }}
            >
              {bulkProcessing ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
