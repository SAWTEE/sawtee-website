<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class CategoryRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($this->routeModelId('category')),
            ],
            'type' => ['required', Rule::in(['post', 'publication', 'research', 'team'])],
            'parent_id' => ['nullable', 'numeric', 'exists:categories,id'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'name.unique' => 'A category with this name already exists.',
            'type.required' => 'Please choose a type.',
            'type.in' => 'Type must be post, publication, research, or team.',
            'parent_id.exists' => 'The selected parent category is invalid.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'parent_id' => 'parent category',
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
        ];
    }
}
