<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin E-DTC',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
        ]);

        // Create default user
        User::create([
            'name' => 'User Default',
            'email' => 'user@gmail.com',
            'password' => Hash::make('user123'),
        ]);

        // Create additional test users
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
        ]);
    }
}