<?php

declare(strict_types=1);

namespace Components\Webhooks\Services;

readonly class WebhookSecurityService
{
    private const array BLOCKED_SCHEMES = ['file', 'php', 'data', 'glob', 'phar', 'ssh2', 'rar', 'ogg', 'expect'];
    private const array BLOCKED_HOSTS = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];

    public function validateProxyUrl(string $url): bool
    {
        $parsedUrl = parse_url($url);

        if ($parsedUrl === false || !isset($parsedUrl['scheme']) || !isset($parsedUrl['host'])) {
            return false;
        }

        if (in_array(strtolower($parsedUrl['scheme']), self::BLOCKED_SCHEMES, true)) {
            return false;
        }

        if ($this->isBlockedHost($parsedUrl['host'])) {
            return false;
        }

        return true;
    }

    private function isBlockedHost(string $host): bool
    {
        $lowerHost = strtolower($host);

        if (in_array($lowerHost, self::BLOCKED_HOSTS, true)) {
            return true;
        }

        if (str_starts_with($lowerHost, '127.')) {
            return true;
        }

        if (str_contains($lowerHost, 'docker') || str_contains($lowerHost, 'internal')) {
            return true;
        }

        $ip = gethostbyname($host);
        if ($ip !== $host && $this->isPrivateIp($ip)) {
            return true;
        }

        return false;
    }

    private function isPrivateIp(string $ip): bool
    {
        $longIp = ip2long($ip);

        if ($longIp === false) {
            return false;
        }

        $privateRanges = [
            ['10.0.0.0', '10.255.255.255'],
            ['172.16.0.0', '172.31.255.255'],
            ['192.168.0.0', '192.168.255.255'],
        ];

        foreach ($privateRanges as [$start, $end]) {
            if ($longIp >= ip2long($start) && $longIp <= ip2long($end)) {
                return true;
            }
        }

        return false;
    }
}
