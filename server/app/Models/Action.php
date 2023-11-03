<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Action extends Pivot
{
    use HasFactory;

    protected $table = 'actions';

    protected $fillable = [
        'ip',
        'account_id',
        'item',
        'item_id',
        'type',
    ];
}
