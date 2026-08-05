<?php

namespace App\Http\Requests\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

abstract class AdminFormRequest extends FormRequest
{
    /**
     * The admin route group is already gated by the "auth" and "verified" middleware.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function isUpdate(): bool
    {
        return in_array($this->method(), ['PUT', 'PATCH'], true);
    }

    /**
     * Resolve the primary key behind a route parameter, whether it was bound to a
     * model instance or left as a raw id.
     */
    protected function routeModelId(string $parameter): ?int
    {
        $value = $this->route($parameter);

        if ($value instanceof Model) {
            return $value->getKey();
        }

        return is_numeric($value) ? (int) $value : null;
    }

    /**
     * Edit forms resubmit already-stored media as a URL or filename string, so upload
     * constraints may only be applied when the field really carries a new file.
     *
     * @param  array<int, mixed>  $rules
     * @return array<int, mixed>
     */
    protected function whenUploaded(string $field, array $rules): array
    {
        return $this->hasFile($field) ? $rules : ['nullable'];
    }

    /**
     * An edit form leaves the field out entirely when it was never touched, whereas a
     * field the editor emptied arrives blank and means "remove the stored media".
     */
    public function mediaWasCleared(string $field = 'image'): bool
    {
        return $this->has($field) && ! $this->filled($field);
    }
}
