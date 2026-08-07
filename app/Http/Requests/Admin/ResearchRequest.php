<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class ResearchRequest extends AdminFormRequest
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
                'min:6',
                'max:255',
                Rule::unique('research', 'title')->ignore($this->routeModelId('research')),
            ],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'year' => ['required', 'integer', 'digits:4', 'min:1900', 'max:'.date('Y')],
            'link' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
            'file' => $this->whenUploaded('file', ['file', 'mimes:pdf,doc,docx', 'max:5120']),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'title.min' => 'Title must be at least 6 characters.',
            'title.unique' => 'A research entry with this title already exists.',
            'year.required' => 'Please enter a year.',
            'year.digits' => 'Year must be a 4-digit number.',
            'year.min' => 'Year must be 1900 or later.',
            'year.max' => 'Year cannot be in the future.',
            'description.max' => 'Description must not be longer than 2000 characters.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
            'file.mimes' => 'Attachment must be a PDF, DOC, or DOCX file.',
            'file.max' => 'Attachment must not be larger than 5 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
        ];
    }
}
