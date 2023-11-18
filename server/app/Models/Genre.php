<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'title',
        'admin_id',
    ];

    public function songs() {
        return $this->belongsToMany(Song::class, 'songs_genres', 'genre_id', 'song_id')
                    ->select([
                        'songs.id',
                        'name',
                        'thumbnail',
                        'released_at',
                    ])
                    ->orderByDesc('released_at');
    }

    public function account() {
        return $this->belongsTo(Account::class, 'admin_id')
                    ->select([
                        'accounts.id',
                        'username',
                        'avatar',
                    ]);
    }
}
