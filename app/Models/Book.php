<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'author',
        'category',
        'description',
        'price',
        'publish_date',
        'isbn',
        'pages',
        'language',
        'status',
        'code',
        'cover',
        'total_pages',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category');
    }
}


