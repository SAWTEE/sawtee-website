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
            'description' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
            'show' => ['required', 'boolean'],
        ];
    }
}
