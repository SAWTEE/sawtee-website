<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class SectionRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sections', 'title')->ignore($this->routeModelId('section')),
            ],
            'type' => ['required', Rule::in(['default', 'tabs', 'accordian', 'members'])],
            'description' => ['nullable', 'string'],
            'link' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'numeric', 'exists:sections,id'],
            'page_id' => ['required', 'numeric', 'exists:pages,id'],
            'order' => ['nullable', 'integer'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:png,jpg,jpeg,webp', 'max:2048']),
        ];
    }
}
