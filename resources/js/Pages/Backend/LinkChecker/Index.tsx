import { Head, router } from '@inertiajs/react';
import { Link2Icon, SearchIcon } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInertiaFlashToast } from '@/hooks/use-inertia-flash';
import { useToast } from '@/hooks/use-toast';

type BrokenLink = {
  url: string;
  status: string;
  source: string;
  type: string;
};

type Report = {
  startedAt: string | null;
  finishedAt: string | null;
  baseUrl: string | null;
  pagesCrawled: number;
  linksChecked: number;
  ok: number;
  brokenCount: number;
  skippedExternal: number;
  truncated: boolean;
  errors: string[];
  broken: BrokenLink[];
  brokenTruncated: boolean;
};

export default function Index({
  auth: _auth,
  report,
}: {
  auth: any;
  report: Report | null;
}) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [maxPages, setMaxPages] = useState(200);
  const [maxLinks, setMaxLinks] = useState(2000);
  const [checkExternal, setCheckExternal] = useState(false);

  useInertiaFlashToast(
    useCallback(
      (message: string) => {
        toast({
          title: 'Link Checker',
          description: message,
        });
      },
      [toast]
    )
  );

  const runScan = () => {
    setProcessing(true);
    router.post(
      route('admin.link-checker.scan'),
      {
        max_pages: maxPages,
        max_links: maxLinks,
        check_external: checkExternal,
      },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      }
    );
  };

  return (
    <>
      <Head title="Link Checker" />

      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Link Checker
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Crawls the public site from <code className="text-xs">APP_URL</code>
            , skips <code className="text-xs">/admin</code>, and reports 404s
            and other HTTP errors — including missing publication and research
            files. External links are skipped unless enabled.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2Icon className="h-5 w-5" />
              Run crawl
            </CardTitle>
            <CardDescription>
              Results are cached for a week and shown below. You can also run{' '}
              <code className="text-xs">php artisan site:check-links</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="max_pages">Max pages</Label>
                <Input
                  id="max_pages"
                  type="number"
                  min={1}
                  max={500}
                  value={maxPages}
                  onChange={e => setMaxPages(Number(e.target.value) || 1)}
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_links">Max links</Label>
                <Input
                  id="max_links"
                  type="number"
                  min={1}
                  max={5000}
                  value={maxLinks}
                  onChange={e => setMaxLinks(Number(e.target.value) || 1)}
                  disabled={processing}
                />
              </div>
              <div className="flex items-end gap-2 pb-2">
                <Checkbox
                  id="check_external"
                  checked={checkExternal}
                  onCheckedChange={v => setCheckExternal(v === true)}
                  disabled={processing}
                />
                <Label htmlFor="check_external" className="font-normal">
                  Check external links
                </Label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton
                type="button"
                onClick={runScan}
                disabled={processing}
                isLoading={processing}
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                {processing ? 'Scanning…' : 'Run scan'}
              </PrimaryButton>
              <Button
                type="button"
                variant="outline"
                disabled={processing}
                onClick={() => router.get(route('admin.link-checker.index'))}
              >
                Refresh report
              </Button>
            </div>
          </CardContent>
        </Card>

        {report ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Pages crawled" value={report.pagesCrawled} />
              <Stat label="Links checked" value={report.linksChecked} />
              <Stat label="OK" value={report.ok} />
              <Stat
                label="Broken"
                value={report.brokenCount}
                emphasize={report.brokenCount > 0}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Last report</CardTitle>
                <CardDescription>
                  Base: {report.baseUrl ?? '—'}
                  {report.finishedAt ? ` · Finished ${report.finishedAt}` : ''}
                  {report.truncated ? ' · Truncated by limits' : ''}
                  {report.skippedExternal > 0
                    ? ` · ${report.skippedExternal} external skipped`
                    : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {report.brokenCount === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No broken links in the last scan.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-muted-foreground border-b">
                          <th className="py-2 pr-3 font-medium">Status</th>
                          <th className="py-2 pr-3 font-medium">URL</th>
                          <th className="py-2 pr-3 font-medium">Found on</th>
                          <th className="py-2 font-medium">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.broken.map(row => (
                          <tr
                            key={`${row.url}|${row.source}|${row.type}`}
                            className="border-border/60 border-b align-top"
                          >
                            <td className="text-destructive py-2 pr-3 font-mono">
                              {row.status}
                            </td>
                            <td className="max-w-md py-2 pr-3 break-all">
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline-offset-2 hover:underline"
                              >
                                {row.url}
                              </a>
                            </td>
                            <td className="text-muted-foreground max-w-xs py-2 pr-3 break-all">
                              {row.source}
                            </td>
                            <td className="text-muted-foreground py-2">
                              {row.type}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {report.brokenTruncated && (
                      <p className="text-muted-foreground mt-3 text-sm">
                        Showing first 200 broken links. Run the artisan command
                        for the full CLI list.
                      </p>
                    )}
                  </div>
                )}

                {report.errors.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium">Crawl notes</p>
                    <ul className="text-muted-foreground list-inside list-disc text-sm">
                      {report.errors.map(err => (
                        <li key={err} className="break-all">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-sm">
              No scan has been run yet. Click <strong>Run scan</strong> to crawl
              the frontend.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: number;
  emphasize?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle
          className={
            emphasize ? 'text-destructive text-2xl' : 'text-2xl tabular-nums'
          }
        >
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
