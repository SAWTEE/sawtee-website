<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Slider extends Model
{

    use HasFactory;

    protected $fillable = ['name', 'page_id'];



    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class);
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }


}
