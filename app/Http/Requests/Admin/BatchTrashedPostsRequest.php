<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class BatchTrashedPostsRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => [
                'integer',
                Rule::exists('posts', 'id')->whereNotNull('deleted_at'),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ids.required' => 'Select at least one trashed post.',
            'ids.min' => 'Select at least one trashed post.',
        ];
    }
}
