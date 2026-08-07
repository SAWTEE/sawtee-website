<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class InstituteRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'link' => ['required', 'string', 'max:255'],
            'logo_image_src' => ['required', 'string', 'max:255'],
            'member_id' => ['required', 'numeric', 'exists:members,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'link.required' => 'Please enter a link.',
            'logo_image_src.required' => 'Please provide a logo image URL.',
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'The selected member is invalid.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'logo_image_src' => 'logo image',
            'member_id' => 'member',
        ];
    }
}
