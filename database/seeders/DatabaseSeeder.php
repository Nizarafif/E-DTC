<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run UserSeeder first
        $this->call([
            UserSeeder::class,
        ]);

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed contoh buku
        Book::query()->updateOrCreate(
            ['slug' => 'book-1'],
            [
                'title' => 'Nama Buku 1',
                'code' => 'KODE PRODUKSI/',
                'cover' => '/images/Image-Cover Buku.svg',
                'total_pages' => 18,
            ]
        );
        Book::query()->updateOrCreate(
            ['slug' => 'book-2'],
            [
                'title' => 'Nama Buku 2',
                'code' => 'KODE PRODUKSI/',
                'cover' => '/images/Image-Cover Buku.svg',
                'total_pages' => 22,
            ]
        );
        Book::query()->updateOrCreate(
            ['slug' => 'book-3'],
            [
                'title' => 'Nama Buku 3',
                'code' => 'KODE PRODUKSI/',
                'cover' => '/images/Image-Cover Buku.svg',
                'total_pages' => 16,
            ]
        );

        // Seed kategori contoh
        $web = Category::updateOrCreate(['slug' => 'web'], ['name' => 'Web Development']);
        $design = Category::updateOrCreate(['slug' => 'design'], ['name' => 'Design']);
        $laravel = Category::updateOrCreate(['slug' => 'laravel'], ['name' => 'Laravel']);

        // Hubungkan kategori ke buku pertama sebagai contoh
        $book1 = Book::where('slug', 'book-1')->first();
        if ($book1) {
            $book1->categories()->syncWithoutDetaching([$web->id, $laravel->id]);
        }
    }
}
