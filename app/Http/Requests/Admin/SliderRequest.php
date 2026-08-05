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
}
