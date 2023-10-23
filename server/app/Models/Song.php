<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'account_id',
        'album_id',
        'thumbnail',
        'lyric',
        'duration',
        'released_at',
    ];
}
