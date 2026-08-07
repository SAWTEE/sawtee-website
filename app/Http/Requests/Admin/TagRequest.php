<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class TagRequest extends AdminFormRequest
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
                'max:60',
                Rule::unique('tags', 'name')->ignore($this->routeModelId('tag')),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'name.max' => 'Name must not be longer than 60 characters.',
            'name.unique' => 'A tag with this name already exists.',
        ];
    }
}
