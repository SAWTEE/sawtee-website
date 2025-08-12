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
        Schema::create('fellows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fellowship_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('designation');
            $table->text('description');
            $table->text('experience');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fellows');
    }
};
