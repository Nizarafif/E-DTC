<?php

namespace App\Http\Controllers;

use App\Models\BookContent;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BookContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BookContent::with('book');
        
        if ($request->has('book_id')) {
            $query->where('book_id', $request->book_id);
        }
        
        $contents = $query->orderBy('order_index')->orderBy('created_at')->get();
        
        // Add PDF URL for PDF content
        $contents->transform(function ($content) {
            if ($content->content_type === 'pdf' && $content->pdf_path) {
                $content->pdf_url = asset('storage/' . $content->pdf_path);
            }
            return $content;
        });
        
        return response()->json($contents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'chapter_number' => 'nullable|string|max:50',
            'chapter_title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get the next order index for this book
            $nextOrderIndex = BookContent::where('book_id', $request->book_id)
                ->max('order_index') + 1;

            $bookContent = new BookContent();
            $bookContent->book_id = $request->book_id;
            $bookContent->chapter_number = $request->chapter_number;
            $bookContent->chapter_title = $request->chapter_title;
            $bookContent->content = $request->content;
            $bookContent->content_type = $request->content_type ?? 'editor';
            $bookContent->pdf_path = $request->pdf_path;
            $bookContent->order_index = $nextOrderIndex;
            $bookContent->save();

            $bookContent->load('book');

            return response()->json([
                'message' => 'Book content created successfully',
                'data' => $bookContent
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create book content',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $bookContent = BookContent::with('book')->findOrFail($id);
            return response()->json($bookContent);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Book content not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'chapter_number' => 'nullable|string|max:50',
            'chapter_title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $bookContent = BookContent::findOrFail($id);
            
            $bookContent->book_id = $request->book_id;
            $bookContent->chapter_number = $request->chapter_number;
            $bookContent->chapter_title = $request->chapter_title;
            $bookContent->content = $request->content;
            $bookContent->content_type = $request->content_type ?? 'editor';
            $bookContent->pdf_path = $request->pdf_path;
            $bookContent->save();

            $bookContent->load('book');

            return response()->json([
                'message' => 'Book content updated successfully',
                'data' => $bookContent
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update book content',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store PDF file for book content.
     */
    public function storePDF(Request $request)
    {
        \Log::info('PDF Upload Request received', [
            'book_id' => $request->book_id,
            'chapter_title' => $request->chapter_title,
            'has_file' => $request->hasFile('pdf_file'),
            'file_size' => $request->hasFile('pdf_file') ? $request->file('pdf_file')->getSize() : 'no file'
        ]);


        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'chapter_number' => 'nullable|string|max:50',
            'chapter_title' => 'nullable|string|max:255',
            'pdf_file' => 'required|file|mimes:pdf|max:51200', // Max 50MB
        ], [
            'book_id.required' => 'Book ID harus diisi',
            'book_id.exists' => 'Buku tidak ditemukan',
            'chapter_title.string' => 'Judul chapter harus berupa teks',
            'chapter_title.max' => 'Judul chapter maksimal 255 karakter',
            'pdf_file.required' => 'File PDF harus diupload',
            'pdf_file.file' => 'File harus berupa file yang valid',
            'pdf_file.mimes' => 'File harus berupa PDF',
            'pdf_file.max' => 'Ukuran file maksimal 50MB',
        ]);

        if ($validator->fails()) {
            \Log::error('PDF Upload Validation failed', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get the next order index for this book
            $nextOrderIndex = BookContent::where('book_id', $request->book_id)
                ->max('order_index') ?? 0;
            $nextOrderIndex += 1;

            // Store PDF file
            $pdfFile = $request->file('pdf_file');
            $fileName = time() . '_' . $pdfFile->getClientOriginalName();
            
            \Log::info('Attempting to store PDF: ' . $fileName);
            $pdfPath = $pdfFile->storeAs('book-contents', $fileName, 'public');
            \Log::info('PDF stored at: ' . $pdfPath);

            if (!$pdfPath) {
                throw new \Exception('Failed to store PDF file');
            }

            $bookContent = BookContent::create([
                'book_id' => $request->book_id,
                'chapter_number' => $request->chapter_number,
                'chapter_title' => $request->chapter_title ?: $pdfFile->getClientOriginalName(),
                'content' => null, // PDF content is stored as file
                'content_type' => 'pdf',
                'pdf_path' => $pdfPath,
                'order_index' => $nextOrderIndex,
            ]);

            $bookContent->load('book');

            return response()->json([
                'message' => 'PDF content uploaded successfully',
                'data' => $bookContent
            ], 201);

        } catch (\Exception $e) {
            \Log::error('PDF Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Failed to upload PDF content',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Upload image for TinyMCE editor
     */
    public function uploadImage(Request $request)
    {
        \Log::info('Upload image request received', [
            'has_file' => $request->hasFile('image'),
            'all_files' => $request->allFiles(),
            'content_type' => $request->header('Content-Type')
        ]);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        try {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('images', $imageName, 'public');

            \Log::info('Image uploaded successfully', [
                'image_name' => $imageName,
                'image_path' => $imagePath,
                'url' => asset('storage/' . $imagePath)
            ]);

            return response()->json([
                'url' => asset('storage/' . $imagePath)
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $bookContent = BookContent::findOrFail($id);
            
            // Delete PDF file if exists
            if ($bookContent->pdf_path && Storage::disk('public')->exists($bookContent->pdf_path)) {
                Storage::disk('public')->delete($bookContent->pdf_path);
            }
            
            $bookContent->delete();

            return response()->json([
                'message' => 'Book content deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete book content',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
