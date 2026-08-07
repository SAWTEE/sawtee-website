<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Ad-hoc image upload from the rich text editor (TinyMCE).
 */
class UploadMediaRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Please upload an image.',
            'file.image' => 'The upload must be an image.',
            'file.mimes' => 'Image must be a JPEG, PNG, or WebP file.',
            'file.max' => 'Image must not be larger than 2 MB.',
        ];
    }
}
