<?php

declare(strict_types=1);

namespace Components\Projects\Enums;

enum ProjectRoleEnum: string
{
    case Member = 'member';
    case Owner = 'owner';
}
