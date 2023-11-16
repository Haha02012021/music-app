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
        Schema::create('songs', function (Blueprint $table) {
            $table->id();
            $table->string('name', TITLE_LENGTH)->unique();
            $table->foreignId('account_id');
            $table->foreignId('album_id')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('lyric')->nullable();
            $table->integer('duration');
            $table->string('audio');
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
        Schema::dropIfExists('songs');
    }
};
