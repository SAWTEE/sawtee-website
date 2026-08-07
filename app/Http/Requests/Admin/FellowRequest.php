<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class FellowRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'fellowship_id' => ['required', 'numeric', 'exists:fellowships,id'],
            'designation' => ['required', 'string', 'max:255'],
            'experience' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'fellowship_id.required' => 'Please select a fellowship.',
            'fellowship_id.exists' => 'The selected fellowship is invalid.',
            'designation.required' => 'Please enter a designation.',
            'experience.required' => 'Please enter experience details.',
            'description.required' => 'Please enter a description.',
            'image.image' => 'The photo must be an image file.',
            'image.mimes' => 'Photo must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Photo must not be larger than 2 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'fellowship_id' => 'fellowship',
        ];
    }
}
