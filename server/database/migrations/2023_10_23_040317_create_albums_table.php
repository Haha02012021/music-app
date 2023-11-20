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
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('title', TITLE_LENGTH)->unique();
            $table->string('thumbnail')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('account_id');
            $table->string('type')->default(1)->comment('1:album; 2:playlist; 3-*:top100');
            $table->date('released_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
