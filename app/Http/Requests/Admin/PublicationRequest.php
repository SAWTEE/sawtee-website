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
}
