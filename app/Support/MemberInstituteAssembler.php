<?php

namespace App\Support;

use App\Models\Institute;
use App\Models\Member;
use Illuminate\Support\Str;

class MemberInstituteAssembler
{
    /**
     * @return list<array{slug: string, member_name: string, member_website_link: string, short_label: string, logo: ?string}>
     */
    public function forMarquee(): array
    {
        return Member::query()
            ->with(['institutes' => fn ($query) => $query->orderBy('id')])
            ->orderBy('id')
            ->get()
            ->flatMap(function (Member $member) {
                return $member->institutes->map(function (Institute $institute) {
                    $logo = trim((string) $institute->logo_image_src);

                    return [
                        'slug' => Str::slug($this->shortLabel($institute->name)),
                        'member_name' => $institute->name,
                        'member_website_link' => $institute->link,
                        'short_label' => $this->shortLabel($institute->name),
                        'logo' => $logo !== '' ? $logo : null,
                    ];
                });
            })
            ->values()
            ->all();
    }

    protected function shortLabel(string $name): string
    {
        if (preg_match('/\(([^)]+)\)/', $name, $matches) === 1) {
            return trim(explode(',', $matches[1])[0]);
        }

        return trim(explode(',', $name)[0]);
    }
}
