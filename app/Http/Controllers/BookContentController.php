<?php

namespace App\Http\Controllers;

use App\Models\BookContent;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

            $bookContent = BookContent::create([
                'book_id' => $request->book_id,
                'chapter_number' => $request->chapter_number,
                'chapter_title' => $request->chapter_title,
                'content' => $request->content,
                'order_index' => $nextOrderIndex,
            ]);

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
            
            $bookContent->update([
                'book_id' => $request->book_id,
                'chapter_number' => $request->chapter_number,
                'chapter_title' => $request->chapter_title,
                'content' => $request->content,
            ]);

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
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $bookContent = BookContent::findOrFail($id);
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
