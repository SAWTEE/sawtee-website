<?php

namespace Database\Seeders;

use App\Models\Institute;
use App\Models\Member;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MemberInstitutesSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/member-institutes.json');

        if (! File::exists($path)) {
            $this->command?->warn('Missing database/data/member-institutes.json — skipped.');

            return;
        }

        /** @var list<array{slug: string, member_name: string, member_website_link: string, short_label: string, logo: ?string}> $institutes */
        $institutes = File::json($path);

        $byCountry = [
            'bela' => 'Bangladesh',
            'unnayan-shamannay' => 'Bangladesh',
            'cag' => 'India',
            'cuts' => 'India',
            'drag' => 'India',
            'leaders' => 'Nepal',
            'pro-public' => 'Nepal',
            'jdhr' => 'Pakistan',
            'sdpi' => 'Pakistan',
            'ips' => 'Sri Lanka',
            'lst' => 'Sri Lanka',
        ];

        $membersByCountry = [];

        foreach ($institutes as $instituteData) {
            $slug = $instituteData['slug'];
            $country = $byCountry[$slug] ?? 'Unknown';

            $member = $membersByCountry[$country] ??= Member::query()->firstOrCreate(
                ['country' => $country],
            );

            Institute::query()->updateOrCreate(
                [
                    'member_id' => $member->id,
                    'name' => $instituteData['member_name'],
                ],
                [
                    'link' => $instituteData['member_website_link'],
                    'logo_image_src' => $instituteData['logo'] ?: '',
                ],
            );
        }

        $this->syncAboutPageData();
    }

    protected function syncAboutPageData(): void
    {
        $about = Page::query()
            ->where('slug', 'about')
            ->orWhere('name', 'About')
            ->first();

        if (! $about) {
            return;
        }

        $pageData = Member::query()
            ->with(['institutes' => fn ($query) => $query->orderBy('id')])
            ->orderBy('id')
            ->get()
            ->values()
            ->map(fn (Member $member, int $index) => [
                'id' => $index + 1,
                'country' => $member->country,
                'institutes' => $member->institutes
                    ->values()
                    ->map(fn (Institute $institute, int $instIndex) => [
                        'id' => $instIndex + 1,
                        'member_name' => $institute->name,
                        'member_website_link' => $institute->link,
                    ])
                    ->all(),
            ])
            ->all();

        $about->pageData = $pageData;
        $about->save();
    }
}
