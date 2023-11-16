<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Singer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'thumbnail',
        'bio',
    ];

    public function songs() {
        return $this->belongsToMany(Song::class, 'singers_songs', 'singer_id', 'song_id')
                    ->select([
                        'songs.id',
                        'name',
                        'thumbnail',
                        'duration',
                        'released_at',
                    ]);
    }

    public function albums() {
        return $this->belongsToMany(Album::class, 'singers_albums', 'singer_id', 'album_id')
                    ->select([
                        'albums.id',
                        'title',
                        'thumbnail',
                        'released_at',
                    ]);
    }

    public function followers() {
        return $this->belongsToMany(Account::class, 'singers_followers', 'singer_id', 'follower_id');
    }
}
