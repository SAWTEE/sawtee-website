<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class MenuRequest extends AdminFormRequest
{
    /**
     * The update endpoint has no route parameter; the menu being edited arrives as a
     * serialised `menu` payload appended to the query string by the Inertia form.
     */
    public function menuId(): ?int
    {
        $id = $this->input('menu.id');

        return is_numeric($id) ? (int) $id : null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $menuId = $this->menuId();

        return [
            'title' => [
                'required',
                'string',
                'max:100',
                Rule::unique('menus', 'title')->ignore($menuId),
            ],
            'location' => [
                'required',
                'string',
                'max:100',
                Rule::unique('menus', 'location')->ignore($menuId),
            ],
            'content' => ['nullable', 'string'],
        ];
    }
}
