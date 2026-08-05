<?php

namespace App\MediaLibrary;

use Illuminate\Support\Facades\Image;
use Spatie\MediaLibrary\ResponsiveImages\TinyPlaceholderGenerator\TinyPlaceholderGenerator as TinyPlaceholderGeneratorContract;

class TinyPlaceholderGenerator implements TinyPlaceholderGeneratorContract
{
    public function generateTinyPlaceholder(string $sourceImagePath, string $tinyImageDestinationPath): void
    {
        $bytes = Image::fromPath($sourceImagePath)
            ->scale(width: 32)
            ->blur(5)
            ->toJpeg()
            ->quality(50)
            ->toBytes();

        file_put_contents($tinyImageDestinationPath, $bytes);
    }
}
