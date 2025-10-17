<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Book;
use App\Models\BookContent;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $timeRange = $request->query('range', '7d');
            $now = Carbon::now();
            
            // Calculate date range
            switch ($timeRange) {
                case '24h':
                    $startDate = $now->copy()->subDay();
                    break;
                case '7d':
                    $startDate = $now->copy()->subWeek();
                    break;
                case '30d':
                    $startDate = $now->copy()->subMonth();
                    break;
                case '90d':
                    $startDate = $now->copy()->subMonths(3);
                    break;
                default:
                    $startDate = $now->copy()->subWeek();
            }

            // Get basic counts
            $totalUsers = User::count();
            $totalBooks = Book::count();
            $totalContent = BookContent::count();
            $totalCategories = Category::count();

            // Active users (users who have been active in the time range)
            $activeUsers = User::where('updated_at', '>=', $startDate)->count();
            
            // New users in the time range
            $newUsers = User::where('created_at', '>=', $startDate)->count();

            // Content by type
            $contentByType = BookContent::select('content_type', DB::raw('count(*) as count'))
                ->groupBy('content_type')
                ->get()
                ->pluck('count', 'content_type')
                ->toArray();

            // Content by book
            $contentByBook = BookContent::with('book')
                ->select('book_id', DB::raw('count(*) as count'))
                ->groupBy('book_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'book_title' => $item->book->title ?? 'Unknown Book',
                        'count' => $item->count
                    ];
                })
                ->sortByDesc('count')
                ->take(10)
                ->values();

            // Recent activity (mock data for now)
            $recentActivity = BookContent::with('book')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($content) {
                    return [
                        'id' => $content->id,
                        'type' => 'content_created',
                        'title' => $content->chapter_title,
                        'book' => $content->book->title ?? 'Unknown',
                        'content_type' => $content->content_type,
                        'created_at' => $content->created_at,
                    ];
                });

            // User activity
            $userActivity = User::orderBy('updated_at', 'desc')
                ->limit(20)
                ->get()
                ->map(function ($user) use ($startDate) {
                    $isActive = $user->updated_at >= $startDate;
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'last_active' => $user->updated_at,
                        'is_active' => $isActive,
                        'status' => $isActive ? 'active' : 'inactive',
                        'activity_score' => $isActive ? rand(60, 100) : rand(0, 40),
                    ];
                });

            // Generate trend data
            $userGrowthTrend = $this->generateTrendData('users', $startDate, $now);
            $contentGrowthTrend = $this->generateTrendData('book_contents', $startDate, $now);
            $bookGrowthTrend = $this->generateTrendData('books', $startDate, $now);

            return response()->json([
                'overview' => [
                    'total_users' => $totalUsers,
                    'total_books' => $totalBooks,
                    'total_content' => $totalContent,
                    'total_categories' => $totalCategories,
                    'active_users' => $activeUsers,
                    'new_users' => $newUsers,
                    'total_views' => rand(100, 1000), // Mock data
                ],
                'trends' => [
                    'user_growth' => $userGrowthTrend,
                    'content_growth' => $contentGrowthTrend,
                    'book_growth' => $bookGrowthTrend,
                ],
                'content_stats' => [
                    'by_type' => $contentByType,
                    'by_book' => $contentByBook,
                ],
                'recent_activity' => $recentActivity,
                'user_activity' => $userActivity,
                'time_range' => $timeRange,
                'generated_at' => $now->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch analytics data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function stats(Request $request)
    {
        try {
            $now = Carbon::now();
            $today = $now->copy()->startOfDay();
            $weekAgo = $now->copy()->subWeek();
            $monthAgo = $now->copy()->subMonth();

            // Quick stats
            $stats = [
                'total_users' => User::count(),
                'total_books' => Book::count(),
                'total_content' => BookContent::count(),
                'active_users_today' => User::where('updated_at', '>=', $today)->count(),
                'active_users_week' => User::where('updated_at', '>=', $weekAgo)->count(),
                'new_users_week' => User::where('created_at', '>=', $weekAgo)->count(),
                'new_content_week' => BookContent::where('created_at', '>=', $weekAgo)->count(),
                'new_books_week' => Book::where('created_at', '>=', $weekAgo)->count(),
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function generateTrendData($table, $startDate, $endDate)
    {
        $days = $startDate->diffInDays($endDate);
        $trendData = [];

        for ($i = 0; $i <= $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $count = DB::table($table)
                ->whereDate('created_at', '<=', $date)
                ->count();
            
            $trendData[] = [
                'date' => $date->format('Y-m-d'),
                'value' => $count,
            ];
        }

        return $trendData;
    }
}
