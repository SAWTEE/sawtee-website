<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class FellowRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'fellowship_id' => ['required', 'numeric', 'exists:fellowships,id'],
            'designation' => ['required', 'string', 'max:255'],
            'experience' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => $this->whenUploaded('image', ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']),
        ];
    }
}
