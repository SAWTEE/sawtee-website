<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'show',
        'order',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'show' => 'boolean',
        'order' => 'integer',
    ];
}
