<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ActionType extends Enum
{
    const LIKE = 1;
    const LISTEN = 2;
}
