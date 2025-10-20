<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the users with additional stats.
     */
    public function index()
    {
        try {
            $users = User::select('id', 'name', 'email', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                        'last_login_at' => $user->updated_at,
                        'status' => $this->getUserStatus($user),
                    ];
                });

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user status based on last activity
     */
    private function getUserStatus($user)
    {
        $lastActivity = $user->updated_at;
        $daysSinceLastActivity = now()->diffInDays($lastActivity);
        
        if ($daysSinceLastActivity <= 1) {
            return 'active';
        } elseif ($daysSinceLastActivity <= 7) {
            return 'less_active';
        } else {
            return 'inactive';
        }
    }

    /**
     * Get user statistics for dashboard
     */
    public function stats()
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::where('updated_at', '>=', now()->subDay())->count();
            $inactiveUsers = User::where('updated_at', '<', now()->subWeek())->count();
            $newThisWeek = User::where('created_at', '>=', now()->subWeek())->count();

            return response()->json([
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => $inactiveUsers,
                'new_this_week' => $newThisWeek,
                'last_updated' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch user statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
        ]);

        try {
            $user = User::findOrFail($id);
            
            $updateData = $request->only(['name', 'email']);
            if ($request->has('password')) {
                $updateData['password'] = bcrypt($request->password);
            }
            
            $user->update($updateData);
            
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update user',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            
            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete user',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update([
                'password' => bcrypt($request->password)
            ]);
            
            return response()->json([
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update password',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

