<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class TeamRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('teams', 'email')->ignore($this->routeModelId('team')),
            ],
            'designation' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'order' => ['required', 'integer'],
            'image' => $this->whenUploaded('image', ['image', 'max:2048']),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'A team member with this email already exists.',
            'designation.required' => 'Please enter a designation.',
            'order.required' => 'Please enter a display order.',
            'image.image' => 'The photo must be an image file.',
            'image.max' => 'Photo must not be larger than 2 MB.',
        ];
    }
}
