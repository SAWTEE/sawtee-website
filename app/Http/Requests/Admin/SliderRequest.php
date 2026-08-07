<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class SliderRequest extends AdminFormRequest
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
                'max:255',
                Rule::unique('sliders', 'name')->ignore($this->routeModelId('slider')),
            ],
            'page_id' => ['nullable', 'numeric', 'exists:pages,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'name.unique' => 'A slider with this name already exists.',
            'page_id.exists' => 'The selected page is invalid.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'page_id' => 'page',
        ];
    }
}
