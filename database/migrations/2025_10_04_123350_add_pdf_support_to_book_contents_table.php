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
            $table->string('content_type')->default('editor')->after('content');
            $table->string('pdf_path')->nullable()->after('content_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_contents', function (Blueprint $table) {
            $table->dropColumn(['content_type', 'pdf_path']);
        });
    }
};
