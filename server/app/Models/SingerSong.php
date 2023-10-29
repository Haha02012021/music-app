<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SingerSong extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'singer_id',
        'song_id',
    ];
}
