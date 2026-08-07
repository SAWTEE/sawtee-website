<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class FellowshipRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'year' => ['required', 'integer', 'digits:4', 'min:2023'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a title.',
            'description.required' => 'Please enter a description.',
            'description.max' => 'Description must not be longer than 2000 characters.',
            'year.required' => 'Please enter a year.',
            'year.digits' => 'Year must be a 4-digit number.',
            'year.min' => 'Year must be 2023 or later.',
        ];
    }
}
