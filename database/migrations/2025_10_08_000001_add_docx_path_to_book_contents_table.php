<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('book_contents', function (Blueprint $table) {
            if (!Schema::hasColumn('book_contents', 'docx_path')) {
                $table->string('docx_path')->nullable()->after('pdf_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('book_contents', function (Blueprint $table) {
            if (Schema::hasColumn('book_contents', 'docx_path')) {
                $table->dropColumn('docx_path');
            }
        });
    }
};

