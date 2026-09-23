<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class HomePageSectionRequest extends AdminFormRequest
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
                'max:100',
                Rule::unique('home_page_sections', 'name')->ignore($this->routeModelId('home_page_section')),
            ],
            'heading' => ['nullable', 'string', 'max:255'],
            'intro' => ['nullable', 'string', 'max:2000'],
            'description' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
            'show' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'name.max' => 'Name must not be longer than 100 characters.',
            'name.unique' => 'A home page section with this name already exists.',
            'heading.max' => 'Heading must not be longer than 255 characters.',
            'intro.max' => 'Intro must not be longer than 2000 characters.',
            'description.max' => 'Description must not be longer than 255 characters.',
            'show.required' => 'Please choose whether to show this section.',
        ];
    }
}
