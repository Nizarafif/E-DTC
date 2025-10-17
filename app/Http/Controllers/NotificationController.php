<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookContent;

class NotificationController extends Controller
{
    /**
     * Return latest activities as notifications.
     */
    public function index(Request $request)
    {
        $limit = (int) ($request->query('limit', 10));
        if ($limit < 1 || $limit > 50) {
            $limit = 10;
        }

        $items = BookContent::with('book:id,title')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($bc) {
                return [
                    'id' => $bc->id,
                    'type' => $bc->content_type,
                    'title' => $bc->chapter_title,
                    'bookTitle' => optional($bc->book)->title,
                    'created_at' => $bc->created_at,
                ];
            });

        return response()->json([
            'count' => $items->count(),
            'items' => $items,
        ]);
    }
}


