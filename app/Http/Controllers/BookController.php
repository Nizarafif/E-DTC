<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    /**
     * List buku dari database (simple pagination optional).
     */
    public function index(Request $request)
    {
        $books = Book::query()
            ->select([
                'id', 'title', 'author', 'category', 'description', 
                'publish_date', 'isbn', 'pages', 'language', 
                'status', 'slug', 'cover', 'created_at', 'updated_at'
            ])
            ->orderByDesc('id')
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'category' => $book->category,
                    'description' => $book->description,
                    'publishDate' => $book->publish_date,
                    'isbn' => $book->isbn,
                    'pages' => $book->pages,
                    'language' => $book->language,
                    'status' => $book->status,
                    'slug' => $book->slug,
                    'cover' => $book->cover,
                    'createdAt' => $book->created_at,
                    'updatedAt' => $book->updated_at,
                ];
            });
        return response()->json($books);
    }

    /**
     * Simpan buku baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'publishDate' => ['nullable', 'date'],
            'isbn' => ['nullable', 'string', 'max:255'],
            'pages' => ['nullable', 'integer', 'min:1'],
            'language' => ['required', 'string', 'max:10'],
            'status' => ['required', 'string', 'in:draft,review,published,archived'],
            'cover' => ['nullable', 'string', 'max:500000'],
        ]);

        // Generate slug from title
        $slug = \Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        
        // Ensure unique slug
        while (Book::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Handle cover image
        $cover = $validated['cover'] ?? '/images/Image-Cover Buku.svg';
        if (!$cover) {
            $cover = '/images/Image-Cover Buku.svg';
        }
        
        // If it's a data URL (base64), save it as file
        if (preg_match('/^data:image\/(\w+);base64,/', $cover, $matches)) {
            $imageType = $matches[1];
            $imageData = substr($cover, strpos($cover, ',') + 1);
            $imageData = base64_decode($imageData);
            
            $fileName = 'book-cover-' . time() . '.' . $imageType;
            $filePath = 'books/' . $fileName;
            
            Storage::disk('public')->put($filePath, $imageData);
            $cover = '/storage/' . $filePath;
        }

        $book = Book::create([
            'title' => $validated['title'],
            'author' => $validated['author'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'publish_date' => $validated['publishDate'],
            'isbn' => $validated['isbn'],
            'pages' => $validated['pages'],
            'language' => $validated['language'],
            'status' => $validated['status'],
            'slug' => $slug,
            'cover' => $cover,
            'total_pages' => $validated['pages'] ?? 1,
        ]);

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'category' => $book->category,
            'description' => $book->description,
            'publishDate' => $book->publish_date,
            'isbn' => $book->isbn,
            'pages' => $book->pages,
            'language' => $book->language,
            'status' => $book->status,
            'slug' => $book->slug,
            'cover' => $book->cover,
        ], 201);
    }

    /**
     * Upload cover image (multipart/form-data) -> returns public path
     */
    public function uploadCover(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:5120'], // max 5MB
        ]);

        // Simpan ke disk 'public' agar tersymlink ke public/storage
        $path = $request->file('file')->store('books', 'public');
        // Bangun URL absolut agar bisa langsung dipakai pada input URL
        $publicPath = '/storage/' . ltrim($path, '/');
        $publicUrl = url($publicPath);

        return response()->json([
            'path' => $publicUrl,
            'relative' => $publicPath,
        ], 201);
    }

    /**
     * Detail buku berdasarkan slug atau id numerik.
     */
    public function show(string $id)
    {
        $book = Book::query()
            ->where('slug', $id)
            ->orWhere('id', is_numeric($id) ? (int) $id : 0)
            ->first();

        if (!$book) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json([
            'id' => (string) $book->id,
            'title' => $book->title,
            'code' => $book->code,
            'cover' => $book->cover,
            'totalPages' => (int) $book->total_pages,
            'slug' => $book->slug,
        ]);
    }

    /**
     * Update buku.
     */
    public function update(Request $request, int $id)
    {
        $book = Book::findOrFail($id);
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:books,slug,' . $book->id],
            'code' => ['nullable', 'string', 'max:255'],
            'cover' => ['nullable', 'string', 'max:1000'],
            'total_pages' => ['nullable', 'integer', 'min:1'],
        ]);

        $book->title = $validated['title'];
        $book->slug = $validated['slug'];
        $book->code = $validated['code'] ?? null;
        $book->cover = $validated['cover'] ?? $book->cover;
        $book->total_pages = $validated['total_pages'] ?? $book->total_pages;
        $book->save();

        return response()->json([
            'id' => $book->id,
            'slug' => $book->slug,
            'title' => $book->title,
            'code' => $book->code,
            'cover' => $book->cover,
            'total_pages' => (int) $book->total_pages,
        ]);
    }

    /**
     * Hapus buku.
     */
    public function destroy(int $id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // Hapus sumber data demo; kini menggunakan database
}






