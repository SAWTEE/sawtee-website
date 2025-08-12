<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trade_insight_volumes', function (Blueprint $table) {
            $table->id();
            $table->string('volume');
            $table->string('title', 255)->nullable();
            $table->string('slug')->nullable();
            $table->string('subtitle', 255)->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('full_article_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trade_insight_volumes');
    }
};
