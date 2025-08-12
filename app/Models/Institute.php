<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Institute extends Model
{

    use HasFactory;

    protected $fillable = [
        "name",
        "link",
        "logo_image_src",
        "member_id"
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class)->as('member');
    }
}
