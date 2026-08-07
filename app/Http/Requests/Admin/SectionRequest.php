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

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'title.unique' => 'A section with this title already exists.',
            'type.required' => 'Please choose a type.',
            'type.in' => 'Type must be default, tabs, accordian, or members.',
            'page_id.required' => 'Please select a page.',
            'page_id.exists' => 'The selected page is invalid.',
            'parent_id.exists' => 'The selected parent section is invalid.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a PNG, JPG, JPEG, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'page_id' => 'page',
            'parent_id' => 'parent section',
        ];
    }
}
