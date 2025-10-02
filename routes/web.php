<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
// use App\Http\Middleware\VerifyCsrfToken; // gunakan FQCN bawaan framework di bawah

Route::get('/', function () {
    return view('welcome');
});
// Book routes (tanpa CSRF untuk AJAX requests)
Route::withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::post('/books/cover', [BookController::class, 'uploadCover']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

// SPA fallback for React Router routes, exclude book/category routes
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!books|categories).*$');

