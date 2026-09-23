<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * @var array<string, array{heading: string, intro: ?string}>
     */
    private array $copy = [
        'Infocus' => [
            'heading' => 'In focus',
            'intro' => null,
        ],
        'Policy Outreach' => [
            'heading' => 'Policy outreach',
            'intro' => null,
        ],
        'Latest Publications' => [
            'heading' => 'Latest in publications',
            'intro' => null,
        ],
        'Sawtee in Media' => [
            'heading' => 'SAWTEE in media',
            'intro' => 'Press mentions and commentary featuring SAWTEE’s work across South Asia.',
        ],
        'Newsletter' => [
            'heading' => 'SAWTEE e-newsletters',
            'intro' => 'Monthly digests on trade, economics, and environment from the SAWTEE desk.',
        ],
        'Webinar' => [
            'heading' => 'Recordings and resources',
            'intro' => 'Watch recent webinars and download related materials from SAWTEE’s research and dialogue programmes.',
        ],
        'Newsletter Callout' => [
            'heading' => 'Receive the latest publication releases, events and monthly newsletter.',
            'intro' => 'Do you want to get notified? Sign up for our newsletter and you\'ll be among the first to find out about new publication releases, events and monthly newsletter.',
        ],
        'Featured Publication' => [
            'heading' => 'Featured publications',
            'intro' => 'Blogs and articles',
        ],
    ];

    public function up(): void
    {
        Schema::table('home_page_sections', function (Blueprint $table) {
            $table->string('heading')->nullable()->after('name');
            $table->text('intro')->nullable()->after('heading');
        });

        foreach ($this->copy as $name => $fields) {
            DB::table('home_page_sections')
                ->where('name', $name)
                ->update($fields);
        }
    }

    public function down(): void
    {
        Schema::table('home_page_sections', function (Blueprint $table) {
            $table->dropColumn(['heading', 'intro']);
        });
    }
};
