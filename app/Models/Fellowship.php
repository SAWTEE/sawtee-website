<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Fellow;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Fellowship extends Model
{
    use HasFactory;

    // protected $with = ['fellows'];

    protected $fillable = [
        "title",
        "description",
        "year",
    ];

    public function fellows(): HasMany
    {
        return $this->hasMany(Fellow::class);
    }
}
