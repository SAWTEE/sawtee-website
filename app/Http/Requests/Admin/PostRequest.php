<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class PostRequest extends AdminFormRequest
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
                Rule::unique('posts', 'title')
                    ->where('category_id', $this->input('category_id'))
                    ->whereNull('deleted_at')
                    ->ignore($this->routeModelId('post')),
            ],
            'content' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'category_id' => ['required', 'numeric', 'exists:categories,id'],
            'theme_id' => ['nullable', 'numeric', 'exists:themes,id'],
            'author' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['unpublished', 'draft', 'published'])],
            'link' => ['nullable', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
            'file' => $this->whenUploaded('file', ['file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240']),
            'files' => ['nullable', 'array'],
            'files.*' => $this->whenUploaded('files', ['file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240']),
            'remove_content_file_ids' => ['nullable', 'array'],
            'remove_content_file_ids.*' => ['integer', 'exists:files,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['numeric', 'exists:tags,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'title.unique' => 'A post with this title already exists in this category.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'status.required' => 'Please choose a status.',
            'status.in' => 'Status must be unpublished, draft, or published.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
            'file.mimes' => 'Attachment must be a PDF, DOC, DOCX, PPT, or PPTX file.',
            'file.max' => 'Attachment must not be larger than 10 MB.',
            'files.*.mimes' => 'Each content file must be a PDF, DOC, DOCX, PPT, or PPTX file.',
            'files.*.max' => 'Each content file must not be larger than 10 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'theme_id' => 'theme',
            'published_at' => 'publish date',
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
        ];
    }
}
