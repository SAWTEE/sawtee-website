<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperFile
 */
class File extends Model
{
    use HasFactory;

    public function fileable()
    {
        return $this->morphTo();
    }
}
