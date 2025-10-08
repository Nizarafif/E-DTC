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
        Schema::table('book_contents', function (Blueprint $table) {
            $table->string('chapter_title')->nullable()->change();
            $table->longText('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_contents', function (Blueprint $table) {
            $table->string('chapter_title')->nullable(false)->change();
            $table->longText('content')->nullable(false)->change();
        });
    }
};
