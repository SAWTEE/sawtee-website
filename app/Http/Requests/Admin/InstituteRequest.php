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
}
