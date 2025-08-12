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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->foreignId('trade_insight_volume_id')->constrained()->onDelete('cascade');
            $table->string('slug')->nullable();
            $table->string("subtitle")->nullable();
            $table->text("excerpt")->nullable();
            $table->string("author")->nullable();
            $table->longText("content")->nullable();
            $table->timestamp('published_at')->useCurrent();
            $table->string('meta_title')->nullable()->default(null);
            $table->string('meta_description')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
