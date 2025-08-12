<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        "country",
    ];


    public function institutes(): HasMany
    {
        return $this->hasMany(Institute::class)->as('institutes');
    }
}
