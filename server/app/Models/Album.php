<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'account_id',
        'type',
        'released_at',
    ];

    public function singers() {
        return $this->belongsToMany(Singer::class, 'singers_albums', 'album_id', 'singer_id');
    }

    public function actions() {
        return $this->belongsToMany(Account::class, 'actions', 'item_id', 'account_id')
                    ->withPivot(['type', 'item'])
                    ->withTimestamps();
    }

    public function songs() {
        return $this->belongsToMany(Song::class, 'albums_songs', 'album_id', 'song_id');
    }
}
