<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class ThemeRequest extends AdminFormRequest
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
                Rule::unique('themes', 'title')->ignore($this->routeModelId('theme')),
            ],
            'description' => ['required', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'title.unique' => 'A theme with this title already exists.',
            'description.required' => 'Please enter a description.',
            'description.max' => 'Description must not be longer than 2000 characters.',
        ];
    }
}
