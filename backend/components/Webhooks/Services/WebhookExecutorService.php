<?php

declare(strict_types=1);

namespace Components\Webhooks\Services;

use App\Models\WebhookResponse;
use Components\Webhooks\Enums\WebhookResponseTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

readonly class WebhookExecutorService
{
    public function __construct(
        private WebhookSecurityService $securityService,
    ) {
        //
    }

    /**
     * @return array{status: int, headers: array<string, string>, body: string}
     */
    public function execute(WebhookResponse $response, Request $request): array
    {
        return match ($response->type) {
            WebhookResponseTypeEnum::Static => $this->executeStatic($response),
            WebhookResponseTypeEnum::Proxy  => $this->executeProxy($response, $request),
        };
    }

    /**
     * @return array{status: int, headers: array<string, string>, body: string}
     */
    private function executeStatic(WebhookResponse $response): array
    {
        return [
            'status' => $response->status_code ?? 200,
            'headers' => $response->headers ?? [],
            'body' => $response->body ?? '',
        ];
    }

    /**
     * @return array{status: int, headers: array<string, string>, body: string}
     */
    private function executeProxy(WebhookResponse $response, Request $request): array
    {
        if (!$response->proxy_url || !$this->securityService->validateProxyUrl($response->proxy_url)) {
            throw new \RuntimeException('Invalid proxy URL');
        }

        $httpResponse = Http::timeout(30)
            ->withHeaders($request->headers->all())
            ->send(
                $request->method(),
                $response->proxy_url,
                [
                    'body' => $request->getContent(),
                ]
            );

        return [
            'status' => $httpResponse->status(),
            'headers' => $httpResponse->headers(),
            'body' => $httpResponse->body(),
        ];
    }
}
