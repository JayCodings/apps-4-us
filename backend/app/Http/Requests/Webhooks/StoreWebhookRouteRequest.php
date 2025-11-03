<?php

declare(strict_types=1);

namespace App\Http\Requests\Webhooks;

use Components\Webhooks\Enums\WebhookMethodEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWebhookRouteRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'method' => ['required', 'string', Rule::enum(WebhookMethodEnum::class)],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @psalm-return array{name: string, method: string, is_active: bool|null}
     */
    public function validated($key = null, $default = null): array
    {
        return parent::validated($key, $default);
    }
}
