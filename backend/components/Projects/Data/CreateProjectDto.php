<?php

declare(strict_types=1);

namespace Components\Projects\Data;

use JsonSerializable;

final readonly class CreateProjectDto implements JsonSerializable
{
    public function __construct(
        public string $name,
        public ?string $description = null,
    ) {
        //
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
