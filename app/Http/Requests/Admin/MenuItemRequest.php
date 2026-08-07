<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;

class MenuItemRequest extends AdminFormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'menu_id' => ['required', 'numeric', 'exists:menus,id'],
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'url' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'integer'],
            'parent_id' => ['nullable', 'numeric', 'exists:menu_items,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'menu_id.required' => 'Please select a menu.',
            'menu_id.exists' => 'The selected menu is invalid.',
            'name.required' => 'Please enter a name.',
            'title.required' => 'Please enter a title.',
            'parent_id.exists' => 'The selected parent menu item is invalid.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'menu_id' => 'menu',
            'parent_id' => 'parent menu item',
        ];
    }
}
