<?php

namespace App\Console\Commands;

use App\Support\LinkChecker;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CheckBrokenLinks extends Command
{
    protected $signature = 'site:check-links
                            {--base= : Base URL to crawl (defaults to APP_URL)}
                            {--max-pages=200 : Maximum HTML pages to crawl}
                            {--max-links=2000 : Maximum unique links to check}
                            {--external : Also HEAD-check external links}';

    protected $description = 'Crawl the public frontend (excluding /admin) and report broken links';

    public function handle(LinkChecker $checker): int
    {
        $maxPages = max(1, (int) $this->option('max-pages'));
        $maxLinks = max(1, (int) $this->option('max-links'));

        $this->info(sprintf(
            'Crawling up to %d page(s) / %d link(s)%s…',
            $maxPages,
            $maxLinks,
            $this->option('external') ? ' (including external)' : ''
        ));

        $report = $checker->crawl(
            baseUrl: $this->option('base') ?: null,
            maxPages: $maxPages,
            maxLinks: $maxLinks,
            checkExternal: (bool) $this->option('external'),
        );

        $this->newLine();
        $this->table(
            ['Metric', 'Value'],
            [
                ['Base URL', $report['base_url']],
                ['Pages crawled', (string) $report['pages_crawled']],
                ['Links checked', (string) $report['links_checked']],
                ['OK', (string) $report['ok']],
                ['Broken', (string) count($report['broken'])],
                ['External skipped', (string) $report['skipped_external']],
                ['Truncated', $report['truncated'] ? 'yes' : 'no'],
            ]
        );

        if ($report['broken'] !== []) {
            $this->newLine();
            $this->warn('Broken links:');
            $this->table(
                ['Status', 'URL', 'Found on', 'Type'],
                array_map(
                    fn (array $row) => [
                        (string) $row['status'],
                        Str::limit($row['url'], 80),
                        Str::limit($row['source'], 60),
                        $row['type'],
                    ],
                    array_slice($report['broken'], 0, 100)
                )
            );

            if (count($report['broken']) > 100) {
                $this->line('… and '.(count($report['broken']) - 100).' more.');
            }
        } else {
            $this->info('No broken links found.');
        }

        $this->comment('Report cached for the admin Link Checker page.');

        return count($report['broken']) > 0 ? self::FAILURE : self::SUCCESS;
    }
}
