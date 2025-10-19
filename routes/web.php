<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookContentController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AnalyticsController;
// use App\Http\Middleware\VerifyCsrfToken; // gunakan FQCN bawaan framework di bawah

Route::get('/', function () {
    return view('welcome');
});
// Book routes (tanpa CSRF untuk AJAX requests)
Route::withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/admin/books', [BookController::class, 'adminIndex']);
    Route::post('/books', [BookController::class, 'store']);
    Route::post('/books/cover', [BookController::class, 'uploadCover']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/categories-options', [CategoryController::class, 'options']);

    // BookContent routes
    Route::get('/book-contents', [BookContentController::class, 'index']);
    Route::post('/book-contents', [BookContentController::class, 'store']);
    Route::post('/book-contents/pdf', [BookContentController::class, 'storePDF']);
    Route::post('/book-contents/docx', [BookContentController::class, 'storeDOCX']);
    Route::post('/book-contents/upload-image', [BookContentController::class, 'uploadImage']);
    Route::get('/book-contents/{id}', [BookContentController::class, 'show']);
    Route::put('/book-contents/{id}', [BookContentController::class, 'update']);
    Route::delete('/book-contents/{id}', [BookContentController::class, 'destroy']);
    
    // Image upload for TinyMCE
    Route::post('/api/upload-image', [ImageUploadController::class, 'upload']);
    
    // Auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/stats', [UserController::class, 'stats']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}/password', [UserController::class, 'updatePassword']);
    
    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    
    // Analytics routes
    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::get('/analytics/stats', [AnalyticsController::class, 'stats']);
});

// SPA fallback for React Router routes, exclude book/category routes
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!books|categories).*$');




