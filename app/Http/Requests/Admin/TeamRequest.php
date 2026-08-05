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
}
