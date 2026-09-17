<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
