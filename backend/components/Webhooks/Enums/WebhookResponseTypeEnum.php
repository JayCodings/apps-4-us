<?php

declare(strict_types=1);

namespace Components\Webhooks\Enums;

enum WebhookResponseTypeEnum: string
{
    case Proxy = 'proxy';
    case Static = 'static';
}
