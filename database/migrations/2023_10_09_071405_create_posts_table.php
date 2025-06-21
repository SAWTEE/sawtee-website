<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('theme_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title', 255);
            $table->string('slug')->nullable();
            $table->longText('content')->nullable();
            $table->mediumText('excerpt')->nullable();
            $table->string('author')->nullable();
            $table->enum('status', ["unpublished", "draft", "published"])->default('unpublished');
            $table->string('link', 255)->nullable()->default(null);
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
        Schema::dropIfExists('posts');
    }
};
