<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class SlideRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'slider_id' => ['required', 'numeric', 'exists:sliders,id'],
            'image' => $this->isUpdate()
                ? $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:4096'])
                : ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slider_id.required' => 'Please select a slider.',
            'slider_id.exists' => 'The selected slider is invalid.',
            'image.required' => 'Please upload an image.',
            'image.image' => 'The slide image must be an image file.',
            'image.mimes' => 'Slide image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Slide image must not be larger than 4 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'slider_id' => 'slider',
        ];
    }
}
