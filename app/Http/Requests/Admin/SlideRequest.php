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
}
