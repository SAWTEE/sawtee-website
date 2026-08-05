<?php

namespace App\MediaLibrary;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Image;
use Spatie\MediaLibrary\ResponsiveImages\WidthCalculator\WidthCalculator as WidthCalculatorContract;

class WidthCalculator implements WidthCalculatorContract
{
    public function calculateWidthsFromFile(string $imagePath): Collection
    {
        $image = Image::fromPath($imagePath);

        return $this->calculateWidths(
            filesize($imagePath) ?: 0,
            $image->width(),
            $image->height(),
        );
    }

    public function calculateWidths(int $fileSize, int $width, int $height): Collection
    {
        $targetWidths = collect();
        $targetWidths->push($width);

        $ratio = $height / max(1, $width);
        $area = max(1, $height * $width);
        $predictedFileSize = $fileSize;
        $pixelPrice = $predictedFileSize / $area;

        while (true) {
            $predictedFileSize *= 0.7;
            $newWidth = (int) floor(sqrt(($predictedFileSize / $pixelPrice) / $ratio));

            if ($this->finishedCalculating((int) $predictedFileSize, $newWidth)) {
                return $targetWidths;
            }

            $targetWidths->push($newWidth);
        }
    }

    protected function finishedCalculating(int $predictedFileSize, int $newWidth): bool
    {
        return $newWidth < 20 || $predictedFileSize < (1024 * 10);
    }
}
