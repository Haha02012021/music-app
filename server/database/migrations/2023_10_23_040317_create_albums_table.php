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
<<<<<<< HEAD
            $table->string('thumbnail')->nullable();
=======
>>>>>>> d29ad276d9f5d0e82408dae495ac96afc447b6ce
            $table->text('description')->nullable();
            $table->integer('account_id');
            $table->tinyInteger('type')->default(1)->comment('1:album; 2:playlist');
            $table->date('released_at')->nullable();
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
