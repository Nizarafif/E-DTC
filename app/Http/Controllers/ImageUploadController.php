<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Handle image upload for TinyMCE editor
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120', // Max 5MB
            ]);

            $image = $request->file('image');
            
            // Generate unique filename
            $filename = 'editor-' . time() . '-' . Str::random(8) . '.' . $image->getClientOriginalExtension();
            
            // Store in public/storage/editor-images/
            $path = $image->storeAs('editor-images', $filename, 'public');
            
            // Return the public URL
            $url = Storage::url($path);
            
            return response()->json([
                'location' => $url,
                'success' => true,
                'message' => 'Image uploaded successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage(),
                'success' => false
            ], 400);
        }
    }
}

