<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'chapter_number',
        'chapter_title',
        'content',
        'content_type',
        'pdf_path',
        'docx_path',
        'order_index',
    ];

    protected $casts = [
        'book_id' => 'integer',
        'order_index' => 'integer',
    ];

    /**
     * Get the book that owns the content.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}



