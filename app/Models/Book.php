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
        'publish_date',
        'isbn',
        'pages',
        'language',
        'status',
        'code',
        'cover',
        'total_pages',
    ];

    /**
     * Get the contents for the book.
     */
    public function contents()
    {
        return $this->hasMany(BookContent::class)->orderBy('order_index');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category');
    }
}


