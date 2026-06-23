<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;
    protected $table = 'menus';
    protected $fillable = ['title', 'location', 'created_at', 'updated_at'];

    // public function widgets(): HasMany
    // {
    //     return $this->hasMany(Widget::class)->as('widgets');
    // }

}
