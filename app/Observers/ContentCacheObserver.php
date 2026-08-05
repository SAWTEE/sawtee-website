<?php

namespace App\Observers;

use App\Support\ContentCache;

class ContentCacheObserver
{
    public function saved(mixed $model): void
    {
        ContentCache::forgetAll();
    }

    public function deleted(mixed $model): void
    {
        ContentCache::forgetAll();
    }
}
