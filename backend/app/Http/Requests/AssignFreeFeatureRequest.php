<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignFreeFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            "feature" => ["required", "string", Rule::exists("features", "name")],
        ];
    }

    /**
     * @psalm-return array{feature: string}
     */
    public function validated($key = null, $default = null): array
    {
        return parent::validated($key, $default);
    }
}
