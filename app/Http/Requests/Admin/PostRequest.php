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
                Rule::unique('posts', 'title')->ignore($this->routeModelId('post')),
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
            'tags' => ['nullable', 'array'],
            'tags.*' => ['numeric', 'exists:tags,id'],
        ];
    }
}
