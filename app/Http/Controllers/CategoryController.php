<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::withCount('books as books_count')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:255|unique:categories,name',
            'description' => 'nullable|string|max:200',
            'color' => 'required|string|in:blue,green,purple,orange,red,pink,teal,yellow,gray',
            'status' => 'required|string|in:active,inactive',
            'icon' => 'nullable|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color,
            'status' => $request->status,
            'icon' => $request->icon,
        ]);

        // Load books count
        $category->loadCount('books as books_count');

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->loadCount('books as books_count');
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id)
            ],
            'description' => 'nullable|string|max:200',
            'color' => 'required|string|in:blue,green,purple,orange,red,pink,teal,yellow,gray',
            'status' => 'required|string|in:active,inactive',
            'icon' => 'nullable|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color,
            'status' => $request->status,
            'icon' => $request->icon,
        ]);

        // Load books count
        $category->loadCount('books as books_count');

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if category has books
        if ($category->books()->count() > 0) {
            return response()->json([
                'message' => 'Tidak dapat menghapus kategori yang memiliki buku'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus'
        ]);
    }

    /**
     * Get categories for select options
     */
    public function options()
    {
        $categories = Category::where('status', 'active')
            ->select('id', 'name', 'color')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}