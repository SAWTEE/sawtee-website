<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class PublishedStoryRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'link' => ['required', 'url', 'max:255'],
            'fellow_id' => ['required', 'numeric', 'exists:fellows,id'],
            'images' => ['nullable', 'array'],
            'images.*' => $this->whenUploaded('images', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
        ];
    }
}
