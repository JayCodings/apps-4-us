<?php

declare(strict_types=1);

namespace App\Http\Requests\Webhooks;

use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWebhookResponseRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::enum(WebhookResponseTypeEnum::class)],
            'status_code' => ['nullable', 'integer', 'min:100', 'max:599'],
            'headers' => ['nullable', 'array'],
            'headers.*' => ['string'],
            'body' => ['nullable', 'string'],
            'proxy_url' => ['nullable', 'string', 'url'],
        ];
    }

    /**
     * @psalm-return array{name: string, type: string, status_code: int|null, headers: array<string, string>|null, body: string|null, proxy_url: string|null}
     */
    public function validated($key = null, $default = null): array
    {
        return parent::validated($key, $default);
    }
}
