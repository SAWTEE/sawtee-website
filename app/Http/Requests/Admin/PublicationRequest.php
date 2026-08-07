<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class PublicationRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'numeric', 'exists:categories,id'],
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('publications', 'title')->ignore($this->routeModelId('publication')),
            ],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'volume' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048']),
            'file' => $this->isUpdate()
                ? $this->whenUploaded('file', ['file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'])
                : ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx', 'max:10240'],
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
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'title.required' => 'Please enter a title.',
            'title.unique' => 'A publication with this title already exists.',
            'description.max' => 'Description must not be longer than 2000 characters.',
            'image.image' => 'The featured image must be an image file.',
            'image.mimes' => 'Featured image must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'image.max' => 'Featured image must not be larger than 2 MB.',
            'file.required' => 'Please upload a file.',
            'file.mimes' => 'Attachment must be a PDF, DOC, DOCX, PPT, or PPTX file.',
            'file.max' => 'Attachment must not be larger than 10 MB.',
            'tags.*.exists' => 'One or more selected tags are invalid.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
        ];
    }
}
