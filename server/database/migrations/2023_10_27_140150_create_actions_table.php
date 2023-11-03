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
        Schema::create('actions', function (Blueprint $table) {
            $table->id();
            $table->integer('account_id')->nullable();
            $table->string('ip')->nullable();
            $table->integer('item_id');
            $table->tinyInteger('type')->default(1)->comment('1:like, 2:listen');
            $table->tinyInteger('item')->default(1)->comment('1:album, 2:song');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actions');
    }
};
