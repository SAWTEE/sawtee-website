import { Head, router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';

import PrimaryButton from '@/components/Backend/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useInertiaFlashToast } from '@/hooks/use-inertia-flash';
import { useToast } from '@/hooks/use-toast';

type OrphanRow = {
  label: string;
  size: number;
};

type Report = {
  orphanCount: number;
  kept: number;
  bytes: number;
  referencedMediaIds: number;
  referencedBasenames: number;
  orphans: OrphanRow[];
  truncated: boolean;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Index({
  auth: _auth,
  report,
}: {
  auth: any;
  report: Report;
}) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  useInertiaFlashToast(
    useCallback(
      (message: string) => {
        toast({
          title: 'Maintenance',
          description: message,
        });
      },
      [toast]
    )
  );

  const run = (deleteFiles: boolean) => {
    if (
      deleteFiles &&
      !window.confirm(
        `Delete ${report.orphanCount} orphaned file(s)/folder(s) (${formatBytes(report.bytes)})? This cannot be undone.`
      )
    ) {
      return;
    }

    setProcessing(true);
    router.post(
      route('admin.maintenance.clean'),
      { delete: deleteFiles },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      }
    );
  };

  return (
    <>
      <Head title="Maintenance" />

      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Storage cleanup
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Finds files under media-library, Featured_Events, Research_Reports,
            publications, and storage/uploads that are not referenced by
            database records or HTML content. Also clears temporary PDF/image
            leftovers in tmp (page JSON data there is kept). App assets are
            never touched.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Orphans</CardDescription>
              <CardTitle className="text-3xl">{report.orphanCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reclaimable</CardDescription>
              <CardTitle className="text-3xl">
                {formatBytes(report.bytes)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Kept (referenced)</CardDescription>
              <CardTitle className="text-3xl">{report.kept}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Media IDs in DB</CardDescription>
              <CardTitle className="text-3xl">
                {report.referencedMediaIds}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Orphaned files</CardTitle>
              <CardDescription>
                Preview up to 100 items. Run a dry scan anytime; delete only
                when you are sure.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={processing}
                onClick={() => run(false)}
              >
                Rescan (dry-run)
              </Button>
              <PrimaryButton
                type="button"
                disabled={processing || report.orphanCount === 0}
                onClick={() => run(true)}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete orphans
              </PrimaryButton>
            </div>
          </CardHeader>
          <CardContent>
            {report.orphanCount === 0 ? (
              <p className="text-muted-foreground text-sm">
                No orphaned uploads found.
              </p>
            ) : (
              <div className="max-h-[28rem] overflow-auto rounded-md border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 font-medium">Path</th>
                      <th className="px-3 py-2 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.orphans.map(orphan => (
                      <tr key={orphan.label} className="border-border border-t">
                        <td className="px-3 py-2 font-mono text-xs break-all">
                          {orphan.label}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {formatBytes(orphan.size)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {report.truncated ? (
                  <p className="text-muted-foreground border-t px-3 py-2 text-xs">
                    Showing first 100 of {report.orphanCount} orphans.
                  </p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-xs">
          CLI equivalent:{' '}
          <code className="bg-muted rounded px-1 py-0.5">
            php artisan media:clean-orphans
          </code>{' '}
          (add{' '}
          <code className="bg-muted rounded px-1 py-0.5">
            --delete --spatie
          </code>{' '}
          to remove files).
        </p>
      </div>
    </>
  );
}
