<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Update last login time
            $user->touch();
            
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $this->getUserRole($user),
                    'created_at' => $user->created_at,
                ]
            ]);
        }

        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        return response()->json([
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $this->getUserRole($user),
                    'created_at' => $user->created_at,
                ]
            ]);
        }

        return response()->json([
            'message' => 'Not authenticated'
        ], 401);
    }

    /**
     * Determine user role based on email or other criteria
     */
    private function getUserRole($user)
    {
        // For now, we'll use email to determine role
        // You can modify this logic based on your requirements
        if ($user->email === 'admin@gmail.com' || $user->email === 'admin@edtc.com') {
            return 'admin';
        }
        
        return 'user';
    }
}
