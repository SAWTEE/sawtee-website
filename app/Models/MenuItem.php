<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasFactory;
    protected $table = 'menu_items';
    protected $fillable = ['menu_id', 'title', 'name', 'url', 'parent_id', 'order', 'created_at', 'updated_at'];

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->with('children');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    // public function allChildrens() {
    //     return $this->children()->all();
    // }

    public function menu(): BelongsTo
    {

        return $this->belongsTo(Menu::class);

    }
}
