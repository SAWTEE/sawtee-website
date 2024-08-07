<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @mixin IdeHelperSubscriber
 */
class Subscriber extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $gaurded = '';

    protected $fillable = [
        'email',
        'token',
        'verified_at',
        'deleted_at'
    ];
}
