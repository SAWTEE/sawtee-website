<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('published_stories', function (Blueprint $table) {
            $table->string('media_src')->nullable()->after('link');
        });
    }

    public function down(): void
    {
        Schema::table('published_stories', function (Blueprint $table) {
            $table->dropColumn('media_src');
        });
    }
};
