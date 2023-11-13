<?php

namespace App\Models;

use App\Enums\ActionItem;
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
        'audio',
        'released_at',
    ];

    public function author() {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function singers() {
        return $this->belongsToMany(Singer::class, 'singers_songs', 'song_id', 'singer_id')
                    ->select(['singers.id', 'name']);
    }

    public function genres() {
        return $this->belongsToMany(Genre::class, 'songs_genres', 'song_id', 'genre_id');
    }

    public function actions() {
        return $this->belongsToMany(Account::class, 'actions', 'item_id', 'account_id')
                    ->wherePivot('item', ActionItem::SONG)
                    ->withPivot(['type', 'item'])
                    ->withTimestamps();
    }

    public function albums() {
        return $this->belongsToMany(Album::class, 'albums_songs', 'song_id', 'album_id');
    }
}
