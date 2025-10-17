<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookContentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API routes for frontend
Route::get('/books', [BookController::class, 'index']);
Route::get('/book-contents', [BookContentController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/stats', [UserController::class, 'stats']);
Route::get('/notifications', [NotificationController::class, 'index']);

// Book content routes
Route::post('/book-contents', [BookContentController::class, 'store']);
Route::post('/book-contents/pdf', [BookContentController::class, 'storePDF']);
Route::post('/book-contents/docx', [BookContentController::class, 'storeDOCX']);
Route::post('/book-contents/upload-image', [BookContentController::class, 'uploadImage']);
Route::get('/book-contents/{id}', [BookContentController::class, 'show']);
Route::put('/book-contents/{id}', [BookContentController::class, 'update']);
Route::delete('/book-contents/{id}', [BookContentController::class, 'destroy']);