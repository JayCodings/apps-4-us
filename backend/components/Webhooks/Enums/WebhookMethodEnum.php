<?php

declare(strict_types=1);

namespace Components\Webhooks\Enums;

enum WebhookMethodEnum: string
{
    case Delete = 'DELETE';
    case Get = 'GET';
    case Patch = 'PATCH';
    case Post = 'POST';
    case Put = 'PUT';
}
