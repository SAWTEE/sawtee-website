<?php

namespace App\MediaLibrary;

use Illuminate\Support\Facades\Image;
use Spatie\MediaLibrary\ResponsiveImages\TinyPlaceholderGenerator\TinyPlaceholderGenerator as TinyPlaceholderGeneratorContract;

class TinyPlaceholderGenerator implements TinyPlaceholderGeneratorContract
{
    public function generateTinyPlaceholder(string $sourceImagePath, string $tinyImageDestinationPath): void
    {
        $bytes = Image::fromPath($sourceImagePath)
            ->scale(width: 20)
            ->blur(3)
            ->toJpeg()
            ->quality(40)
            ->toBytes();

        file_put_contents($tinyImageDestinationPath, $bytes);
    }
}
