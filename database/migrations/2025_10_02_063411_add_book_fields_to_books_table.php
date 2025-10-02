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
        Schema::table('books', function (Blueprint $table) {
            $table->string('author')->nullable()->after('title');
            $table->string('category')->nullable()->after('author');
            $table->text('description')->nullable()->after('category');
            $table->decimal('price', 10, 2)->nullable()->after('description');
            $table->date('publish_date')->nullable()->after('price');
            $table->string('isbn')->nullable()->after('publish_date');
            $table->integer('pages')->nullable()->after('isbn');
            $table->string('language', 10)->default('id')->after('pages');
            $table->enum('status', ['draft', 'review', 'published', 'archived'])->default('draft')->after('language');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn([
                'author', 'category', 'description', 'price', 
                'publish_date', 'isbn', 'pages', 'language', 'status'
            ]);
        });
    }
};
