<?php

declare(strict_types=1);

namespace Components\Projects\Data;

use Components\Projects\Enums\ProjectTypeEnum;
use JsonSerializable;

final readonly class ProjectDto implements JsonSerializable
{
    public function __construct(
        public ProjectTypeEnum $type,
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
            'type' => $this->type->value,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
