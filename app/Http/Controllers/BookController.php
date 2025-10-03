<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    /**
     * Get all books for the home page
     */
    public function index()
    {
        $books = Book::where('status', 'published')
            ->select('id', 'title', 'code', 'cover', 'description', 'author', 'publish_date', 'isbn', 'pages', 'language', 'status')
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform cover URLs to full URLs
        $books->transform(function ($book) {
            if ($book->cover && !str_starts_with($book->cover, 'http')) {
                $book->cover = Storage::url($book->cover);
            }
            return $book;
        });

        return response()->json($books);
    }

    /**
     * Get all books for admin (including all statuses)
     */
    public function adminIndex()
    {
        $books = Book::select('id', 'title', 'code', 'cover', 'description', 'author', 'publish_date', 'isbn', 'pages', 'language', 'status', 'category')
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform cover URLs to full URLs
        $books->transform(function ($book) {
            if ($book->cover && !str_starts_with($book->cover, 'http')) {
                $book->cover = Storage::url($book->cover);
            }
            return $book;
        });

        return response()->json($books);
    }

    /**
     * Get a specific book by ID
     */
    public function show($id)
    {
        $book = Book::where('id', $id)
            ->where('status', 'published')
            ->select('id', 'title', 'code', 'cover', 'description', 'author', 'publish_date', 'isbn', 'pages', 'language', 'total_pages', 'status')
            ->first();

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        // Transform cover URL to full URL
        if ($book->cover && !str_starts_with($book->cover, 'http')) {
            $book->cover = Storage::url($book->cover);
        }

        return response()->json($book);
    }

    /**
     * Store a newly created book
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'required|string|max:100',
            'slug' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'publish_date' => 'nullable|date',
            'isbn' => 'nullable|string|max:20',
            'pages' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'status' => 'nullable|in:draft,review,published,archived',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $bookData = $request->only([
            'title', 'code', 'slug', 'author', 'description', 
            'publish_date', 'isbn', 'pages', 'language', 'status'
        ]);
        
        // Set default status if not provided
        if (!isset($bookData['status'])) {
            $bookData['status'] = 'published';
        }

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('book-covers', 'public');
            $bookData['cover'] = $coverPath;
        }

        $book = Book::create($bookData);

        return response()->json($book, 201);
    }

    /**
     * Update the specified book
     */
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:100',
            'author' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'publish_date' => 'nullable|date',
            'isbn' => 'nullable|string|max:20',
            'pages' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $bookData = $request->only([
            'title', 'code', 'author', 'description', 
            'publish_date', 'isbn', 'pages', 'language'
        ]);

        if ($request->hasFile('cover')) {
            // Delete old cover if exists
            if ($book->cover) {
                Storage::disk('public')->delete($book->cover);
            }
            
            $coverPath = $request->file('cover')->store('book-covers', 'public');
            $bookData['cover'] = $coverPath;
        }

        $book->update($bookData);

        return response()->json($book);
    }

    /**
     * Remove the specified book
     */
    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        
        // Delete cover file if exists
        if ($book->cover) {
            Storage::disk('public')->delete($book->cover);
        }
        
        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }

    /**
     * Upload book cover
     */
    public function uploadCover(Request $request)
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coverPath = $request->file('cover')->store('book-covers', 'public');
        $coverUrl = Storage::url($coverPath);

        return response()->json([
            'cover_path' => $coverPath,
            'cover_url' => $coverUrl
        ]);
    }
}